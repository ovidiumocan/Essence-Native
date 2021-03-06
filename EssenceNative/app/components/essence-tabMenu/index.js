'use strict';

const React = require('react-native');
const styles = require('./styles');

const UiTabItem = require('../essence-tabItem/index');


const {
  Component,
  Dimensions,
  View,
  PropTypes
  } = React;


class UiTabMenu extends Component {
  static BOX_HEIGHT = 70;
  static Item = UiTabItem;

  static propTypes = {
    items: PropTypes.array,
    onLoad: PropTypes.func,
    onUnload: PropTypes.func,
    onChange: PropTypes.func,
    onRefresh: PropTypes.func,
    height: PropTypes.number,
    position: PropTypes.oneOf(['bottom', 'top'])
  };

  static defaultProps = {
    height: UiTabMenu.BOX_HEIGHT,
    position: 'bottom'
  };

  constructor(props) {
    super(props);
    this.state = {
      activeTab: null
    };
  }

  checkActive() {
    console.log(this.props.items);
    let hasActive = false;
    for (var i = 0; i < this.props.items.length; i++) {
      if (this.props.items[i].active === true) {
        this.setState({
          activeTab: this.props.items[i].name
        });
        hasActive = true;
        break;
      }
    }
    if (!hasActive) {
      this.props.items[0].active = true;
      this.setState({
        activeTab: this.props.items[0].name
      });
    }
  }

  componentWillMount() {
    this.props.onLoad && this.props.onLoad(this.props.height);
    this.checkActive();
  }

  componentDidMount() {
    this.props.onChange && this.props.onChange(this.state.activeTab, true);
  }

  componentWillUnmount() {
    this.props.onUnload && this.props.onUnload();
  }

  setActiveTab(item) {
    let itemName = (typeof item === 'object' ? item.name : item);
    const { items } = this.props;
    if (this.state.activeTab === itemName) {
      return this.props.onRefresh && this.props.onRefresh
    }
    this.props.onChange && this.props.onChange(itemName, false);
    this.setState({
      activeTab: itemName
    });
  }

  renderItems() {
    const { items } = this.props;
    let viewItems = [];
    for (let i = 0; i < items.length; i++) {
      let item = items[i];
      viewItems.push(
        <UiTabItem
          key={i}
          active={items[i].name == this.state.activeTab}
          onPress={this.setActiveTab.bind(this, item)}
          icon={item.icon}
          badge={item.badge}
        >
          {item.name}
        </UiTabItem>
      );
    }
    return viewItems;
  }

  render() {
    const { width } = Dimensions.get('window');
    const localStyle = {
      width: width,
      height: this.props.height
    };
    this.props.position === 'bottom' ? localStyle.bottom = 0 : localStyle.top = 0;
    return (
      <View style={[styles.wrapper, localStyle, this.props.style]}>
        {this.renderItems()}
      </View>
    )
  }
}


module.exports = UiTabMenu;
