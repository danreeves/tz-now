import React from "react";
import styled from "react-emotion";
import memoize from "memoize-one";

const Wrapper = styled.div`
  position: relative;
  display: inline-block;
`;

const Input = styled.input`
  border: 1px solid lightgrey;
  background: transparent;
  padding: 0.5rem;
  margin: 0.25rem;
  margin-left: 0;
  color: lightgrey;
`;

const Menu = styled.div`
  position: absolute;
  left: 0;
  min-width: 100%;
  max-height: 200px;
  overflow: scroll;
  background: black;
  border: 1px solid lightgrey;
`;

const Item = styled.div`
  padding: 0.25rem;
  white-space: nowrap;
  cursor: pointer;
  ${({ highlight }) =>
    highlight &&
    `
      color: white;
      padding-left: calc(2ch + 0.25rem);
      &::before {
        content: '> ';
        position: absolute;
        left: 0.25rem;
      }
  `};
`;

function filterOptions(filter, options) {
  const regex = new RegExp(`.*${filter.toLowerCase()}.*`);
  return options.filter(option => option.toLowerCase().search(regex) > -1);
}

const memoizedFilter = memoize(filterOptions);

export class Select extends React.PureComponent {
  constructor(props) {
    super(props);
    this.input = React.createRef();
    this.state = {
      value: "",
      selected: "",
      options: props.options,
      filteredOptions: []
    };
  }

  static getDerivedStateFromProps(props, state) {
    if (props.options !== state.options) {
      return {
        options: props.options,
        filteredOptions: memoizedFilter(state.value, props.options)
      };
    }
    return null;
  }

  onChange = e => {
    const value = e.target.value;
    this.setState(prevState => ({
      value,
      selected: "",
      filteredOptions: memoizedFilter(value, prevState.options)
    }));
  };

  onBlur = () => {
    this.setState({ value: "" });
  };

  onKeyDown = e => {
    switch (e.key) {
      case "Escape":
        e.target.blur();
        this.setState({ highlighted: -1 });
        break;
      case "ArrowUp":
        e.preventDefault();
        this.setState(prevState => {
          const selected = prevState.selected
            ? prevState.filteredOptions[
                prevState.filteredOptions.indexOf(prevState.selected) - 1
              ]
            : prevState.filteredOptions[prevState.filteredOptions.length - 1];
          return {
            selected
          };
        });
        break;
      case "ArrowDown":
        e.preventDefault();
        this.setState(prevState => {
          const selected = prevState.selected
            ? prevState.filteredOptions[
                prevState.filteredOptions.indexOf(prevState.selected) + 1
              ]
            : prevState.filteredOptions[0];
          return {
            selected
          };
        });
        break;
      case "Enter":
        e.preventDefault();
        const { selected } = this.state;
        if (selected) {
          this.selectOption(selected);
        }
        break;
      default:
        break;
    }
  };

  onHoverItem = option => () => {
    this.setState({
      selected: option
    });
  };

  selectOption = option => {
    this.setState({
      value: "",
      selected: ""
    });
    this.props.onSelect && this.props.onSelect(option);
  };

  render() {
    const { value, selected, filteredOptions } = this.state;

    return (
      <Wrapper>
        <Input
          placeholder="Add a timezone..."
          type="text"
          ref={this.input}
          value={value}
          onChange={this.onChange}
          onBlur={this.onBlur}
          onKeyDown={this.onKeyDown}
        />
        {value && (
          <Menu>
            {filteredOptions.map(option => (
              <Item
                key={option}
                highlight={option === selected}
                onMouseEnter={this.onHoverItem(option)}
                onClick={() => this.selectOption(option)}
              >
                {option}
              </Item>
            ))}
          </Menu>
        )}
      </Wrapper>
    );
  }
}
