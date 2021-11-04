/* eslint-disable jest/valid-expect */
import { expect } from 'chai'
import { shallow } from 'enzyme'
import { Roster } from './Lobby'

describe('Roster', () => {
  const propsRoster = {
    teams: [
      {
        id: 'teamId',
        name: 'teamName',
        players: [
          {
            id: 'playerId',
            name: 'playerName',
            email: 'playerEmail',
          }
        ],
        score: 0,
      },
      {
        id: 'teamId2',
        name: 'teamName2',
        players: [],
        score: 0,
      }
    ],
    maxPerTeam: 2,
    playerId: "playerId"
  }

  it('should render teams', () => {
    const props = propsRoster
    const wrapper = shallow(<Roster {...props} />)
    expect(wrapper.find('.lobby__teams')).length(1)
  })

  it('should render teams with players', () => {
    const props = propsRoster
    const wrapper = shallow(<Roster {...props} />)
    expect(wrapper.find('.lobby__team')).length(2)
    expect(wrapper.find('.lobby__team--name')).length(2)
    expect(wrapper.find('.lobby__team--name').at(0).text()).equal('teamName (1/2)')
    expect(wrapper.find('.lobby__team--name').at(1).text()).equal('teamName2 (0/2)')
    expect(wrapper.find('Popover')).length(1)
  })
})