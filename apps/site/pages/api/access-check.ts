import { checkForSponsorship } from '@protected/_utils/github'
import { siteRootDir } from '@protected/studio/constants'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { NextApiHandler } from 'next'
import { UserAccessStatus } from 'types'

const usernameWhitelist = ['natew', 'alitnk']

const handler: NextApiHandler = async (req, res) => {
  const supabase = createServerSupabaseClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()
  const user = session?.user
  const userGithubToken = user?.user_metadata.github_token ?? session?.provider_token

  if (!user)
    return res.status(401).json({
      error: 'The user does not have an active session or is not authenticated',
      action: `${siteRootDir}/login`,
    })

  const githubLogin =
    session.user.user_metadata.user_name ??
    session.user?.identities?.find((identity) => identity.provider === 'github')
      ?.identity_data?.user_name
  if (
    session.user.app_metadata.provider !== 'github' ||
    !githubLogin ||
    !userGithubToken
  ) {
    console.error(`Failed to get github data for ${user.email}.`, { session })
    res.status(403).json({
      error: 'No GitHub connection found. Try logging out and logging in again.',
      action: `${siteRootDir}/account`,
    })
    return
  }

  const { orgs, personal } = await checkForSponsorship(githubLogin, userGithubToken)
  const isWhitelisted = usernameWhitelist.includes(githubLogin)
  const isSponsor = !!personal?.isSponsoring || orgs.some((org) => org.isSponsoring)
  const accessStudio =
    !!personal?.tierIncludesStudio || orgs.some((org) => org.tierIncludesStudio)

  res.json({
    access: {
      studio: accessStudio,
    },
    isSponsor,
    isWhitelisted,
    githubStatus: { orgs, personal },
  } satisfies UserAccessStatus)
}

export default handler
