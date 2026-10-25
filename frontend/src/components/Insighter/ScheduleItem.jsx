import React, { Component } from 'react';
import api from '../../lib/api';
import './ScheduleItem.css';

const logError = (err) => console.error(err);

class ScheduleItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.id,
      title: this.props.title,
      price: this.props.price,
      checked: this.props.checked,
      editMode: Boolean(this.props.editMode),
      deleted: false,
    };
  }

  // The list can switch every item into edit mode; each item can also toggle its own.
  componentDidUpdate(prevProps) {
    if (prevProps.editMode !== this.props.editMode) this.setState({ editMode: Boolean(this.props.editMode) });
  }

  getTitleInput(val) {
    this.setState({ title: val });
  }
  getPriceInput(val) {
    this.setState({ price: val });
  }
  updateTitle(id) {
    api.put(`/api/schedule/item/title/${id}`, { title: this.state.title }).catch(logError);
  }
  updatePrice(id) {
    api.put(`/api/schedule/item/price/${id}`, { price: this.state.price }).catch(logError);
  }
  toggleChecked(id) {
    const checked = !this.state.checked;
    this.setState({ checked });
    api.put(`/api/schedule/item/check/${id}`, { checked }).catch(logError);
  }
  toggleEditMode() {
    this.setState({ editMode: !this.state.editMode });
  }
  deleteItem(id) {
    this.setState({ deleted: true });
    api.delete(`/api/schedule/item/${id}`).catch(logError);
  }

  render() {
    const { id, title, price, checked, deleted, editMode } = this.state;
    const themeColor = { backgroundColor: `rgb(${this.props.color})` };

    if (deleted) return null;
    return !editMode ? (
      <div className="schedule-item">
        <a className="item-title">{title} </a>
        <a className="item-price">{price * 1 === 0 ? null : `$${price}`}</a>
        <button className="item-edit" onClick={() => this.toggleEditMode()} aria-label="Edit item">
          <i className="fas fa-edit"></i>
        </button>
        {checked ? (
          <div onClick={() => this.toggleChecked(id)} className="check-box checked" style={themeColor}>
            <i className="fas fa-check"></i>
          </div>
        ) : (
          <div onClick={() => this.toggleChecked(id)} className="check-box unchecked">
            <i className="fas fa-check"></i>
          </div>
        )}
      </div>
    ) : (
      <div className="schedule-item schedule-selected">
        <input onChange={(e) => this.getTitleInput(e.target.value)} onBlur={() => this.updateTitle(id)} value={title} className="title-input" maxLength={100} aria-label="Title" />
        <input
          onChange={(e) => this.getPriceInput(e.target.value)}
          onBlur={() => this.updatePrice(id)}
          value={price}
          type="number"
          min="0"
          className="price-input"
          aria-label="Price"
        />
        <button className="item-edit" onClick={() => this.toggleEditMode()} aria-label="Done editing">
          <i className="fas fa-edit"></i>
        </button>
        <button onClick={() => this.deleteItem(id)} className="schedule-delete" aria-label="Delete item">
          <i className="fas fa-trash-alt"></i>
        </button>
      </div>
    );
  }
}

export default ScheduleItem;
