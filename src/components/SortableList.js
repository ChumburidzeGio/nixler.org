import React from 'react'
import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc'
import List, { ListItem, ListItemText } from 'material-ui/List'
import KeyboardArrowRightIcon from 'material-ui-icons/KeyboardArrowRight'
import DragHandleIcon from 'material-ui-icons/DragHandle'

const DragHandle = SortableHandle(() => <DragHandleIcon/>)

const SortableItem = SortableElement(({item, onItemClick}) => {
    return (
        <ListItem onClick={onItemClick} button>
            <div style={{cursor: 'move'}}><DragHandle /></div>
            <ListItemText primary={item.label} secondary={item.type}/>
            <KeyboardArrowRightIcon />
        </ListItem>
    )
})

const SortableList = SortableContainer(({items, onItemClick}) => {
    return (
        <List>
            {items.map((item, index) => (
                <SortableItem key={`item-${index}`} index={index} item={item} onItemClick={() => onItemClick(item)} />
            ))}
        </List>
    )
})

export default SortableList