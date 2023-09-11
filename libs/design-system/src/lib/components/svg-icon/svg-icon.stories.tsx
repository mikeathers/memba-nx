import {Meta, StoryObj} from '@storybook/react'
import {SvgIcon} from './svg-icon.component'
import {iconTokens} from '../../styles'

const Story: Meta<typeof SvgIcon> = {
  title: 'Components/Svg Icons',
  component: SvgIcon,
}

export default Story

// @ts-ignore
export const Primary: StoryObj<typeof SvgIcon> = () =>
  Object.values(iconTokens).map((icon) => <SvgIcon key={icon} name={icon} />)
