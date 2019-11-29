import React, { useState, ReactNode, CSSProperties } from "react";

import { FormControl, Dropdown } from "react-bootstrap";
import { SelectCallback } from "react-bootstrap/helpers";

const SearchableListPicker: React.FC<{title: string, options: Array<string>, onSelected: SelectCallback, default?: string}> = (props) => {
    // The forwardRef is important!!
// Dropdown needs access to the DOM node in order to position the Menu
type TRef = HTMLAnchorElement;
type TProps = {children?: ReactNode, onClick?: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void};
const CustomToggle = React.forwardRef<TRef, TProps>(({ children, onClick }, ref) => (
  <a
    href=""
    ref={ref}
    onClick={e => {
      e.preventDefault();
      if (onClick) {
        onClick(e);
      }
    }}
  >
    {children}
    &#x25bc;
  </a>
));
  
  // forwardRef again here!
  // Dropdown needs access to the DOM of the Menu to measure it

  type Ref = HTMLDivElement;
  type Props = {children?: ReactNode, style?: CSSProperties, className?: string, 'aria-labelledby'?: string};
  const [value, setValue] = useState({searchTerm: props.default ? props.default : '', selectionIndex: -1});
  const CustomMenu = React.forwardRef<Ref, Props> (
    ({ children, style, className, 'aria-labelledby': labeledBy }, ref) => {
  
      return (
        <div
          ref={ref}
          style={style}
          className={className}
          aria-labelledby={labeledBy}
        >
          <FormControl
            autoFocus
            className="mx-3 my-2 w-auto"
            placeholder="Type to filter..."
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValue({
                searchTerm: e.target.value,
                selectionIndex: value.selectionIndex,
            })}
            value={value.searchTerm}/>
          <ul className="list-unstyled">
            {React.Children.toArray(children).filter(
              (child: any) =>
                !value.searchTerm || child.props.children.toLowerCase().startsWith(value.searchTerm),
            )}
          </ul>
        </div>
      );
    },
  );

  const selectionMethod: SelectCallback = (eventKey: string, e:React.SyntheticEvent<unknown, Event>): void => {
      setValue({
          searchTerm: '',
          selectionIndex: props.options.indexOf(eventKey)
      });
      return props.onSelected(eventKey, e);
  }

  
  return (
    <Dropdown onSelect={selectionMethod}>
      <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components">
        {value.selectionIndex === -1 ? props.title : props.options[value.selectionIndex]}
      </Dropdown.Toggle>
      <Dropdown.Menu as={CustomMenu}>
        {props.options.map((s: string) => <Dropdown.Item eventKey={s}>{s}</Dropdown.Item>)}
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default SearchableListPicker;