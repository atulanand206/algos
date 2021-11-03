import { expect } from 'chai';
import { shallow } from 'enzyme';
import { State, Avatar } from './State';

describe('Avatar', () => {

  it('should render team avatar with players', () => {
    const props = {
      team: {
        id: "test-id-1",
        name: "test-name-1",
        score: 12,
        players: [{
          id: "test-id-2",
          name: "test-name-2",
          email: "test-email-1"
        }]
      },
      active: true
    }
    const wrapper = shallow(<Avatar {...props} />);
    expect(wrapper.find('.state__team--name').at(0).text()).equal('test-name-1');
    expect(wrapper.find('.state__team--turn').at(0).text()).equal('...');
    expect(wrapper.find('.state__team--score').at(0).text()).equal('12');
    expect(wrapper.find('.state__team--player').at(0).text()).equal('test-name-2');
  });

  it('should render team avatar without players', () => {
    const props = {
      team: {
        id: "test-id-1",
        name: "test-name-1",
        score: 12,
        players: []
      },
      active: true
    }
    const wrapper = shallow(<Avatar {...props} />);
    expect(wrapper.find('.state__team--name').at(0).text()).equal('test-name-1');
    expect(wrapper.find('.state__team--turn').at(0).text()).equal('...');
    expect(wrapper.find('.state__team--score').at(0).text()).equal('12');
    expect(wrapper.find('.state__team--player')).length(0);
  });
})

describe('State', function () {

  it('should render hidden table with teams in the beginning', () => {
    const props = {
      teams: [{
        id: "test-id-1",
        name: "test-name-1",
        score: 0,
        players: [{
          id: "test-id-2",
          name: "test-name-2",
          email: "test-email-1"
        }]
      },
      {
        id: "test-id-3",
        name: "test-name-3",
        score: 0,
        players: [{
          id: "test-id-4",
          name: "test-name-4",
          email: "test-email-2"
        }]
      }],
      currentTeamId: "test-id-3",
    }
    const wrapper = shallow(
      <State {...props} />
    );
    expect(wrapper.find('.state__table--hidden')).length(1);
    expect(wrapper.find('.state__table')).length(0);
    expect(wrapper.find('.fa-arrow-left')).length(1);
    expect(wrapper.find('.state__header--text').text()).equal('scores');
    expect(wrapper.find('Avatar').at(0).prop('active')).equal(false);
    expect(wrapper.find('Avatar').at(1).prop('active')).equal(true);
  });

  it('should render table with teams on clicking toggle', () => {
    const props = {
      teams: [{
        id: "test-id-1",
        name: "test-name-1",
        score: 0,
        players: [{
          id: "test-id-2",
          name: "test-name-2",
          email: "test-email-1"
        }]
      },
      {
        id: "test-id-3",
        name: "test-name-3",
        score: 0,
        players: [{
          id: "test-id-4",
          name: "test-name-4",
          email: "test-email-2"
        }]
      }],
      currentTeamId: "test-id-3",
    }
    const wrapper = shallow(
      <State {...props} />
    );
    const toggle = wrapper.find('.state__header--icon');
    toggle.simulate('click');
    expect(wrapper.find('.state__table--hidden')).length(0);
    expect(wrapper.find('.state__table')).length(1);
    expect(wrapper.find('.fa-arrow-up')).length(1);
    expect(wrapper.find('.state__header--text').text()).equal('scores');
    expect(wrapper.find('Avatar').at(0).prop('active')).equal(false);
    expect(wrapper.find('Avatar').at(1).prop('active')).equal(true);
  });
});