import { Input, TamaguiProvider, YStack, styled } from 'tamagui'

const TransparentInput = styled(Input, {
  borderColor: 'red',
  borderWidth: 2,
  outlineColor: 'transparent',
  hoverStyle: {
    borderColor: 'green',
    outlineColor: 'transparent',
    borderWidth: 5,
  },
  focusStyle: {
    borderColor: 'blue',
    outlineColor: 'transparent',
    borderWidth: 0,
  },
})

export default function SandboxStyledOverridePseudo() {
  return (
    <YStack space="$4">
      <TransparentInput placeholder="transparent border 0px" />
      <Input placeholder="default input" />
    </YStack>
  )
}
