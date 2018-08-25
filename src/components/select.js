import React from "react";
import Autocomplete from "react-autocomplete";
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
  overflow-y: scroll;
  background: black;
  border: 1px solid lightgrey;
  z-index: 10;
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

export class Select extends React.Component {
  state = { value: "" };

  onChange = e => {
    this.setState({ value: e.target.value });
  };

  onSelect = value => {
    const { onSelect } = this.props;
    this.setState({ value: "" });
    if (onSelect) {
      onSelect(value);
    }
  };

  getItemValue(item) {
    return item;
  }

  renderItem(item, isHighlighted) {
    return (
      <Item key={item} highlight={!!isHighlighted}>
        {item}
      </Item>
    );
  }

  shouldItemRender(item, value) {
    return item.toLowerCase().includes(value.toLowerCase());
  }

  renderMenu(items) {
    return <Menu children={items} />;
  }

  renderInput(props) {
    const { ref, ...rest } = props;
    return (
      <Input {...rest} innerRef={ref} placeholder="Search for a timezone..." />
    );
  }

  render() {
    const { options, onSelect } = this.props;
    const { value } = this.state;
    return (
      <Autocomplete
        wrapperStyle={{ position: "relative", display: "inline-block" }}
        autoHighlight={true}
        getItemValue={this.getItemValue}
        items={options}
        onChange={this.onChange}
        onSelect={this.onSelect}
        renderItem={this.renderItem}
        renderMenu={this.renderMenu}
        renderInput={this.renderInput}
        shouldItemRender={this.shouldItemRender}
        value={value}
      />
    );
  }
}
