import React, { Component } from 'react';
import api from '../../lib/api';
import './PackingItem.css';

const logError = (err) => console.error(err);

class PackingItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.id,
      title: this.props.title,
      checked: this.props.checked,
      deleted: false,
    };
  }

  getTitleInput(val) {
    this.setState({ title: val });
  }
  updateTitle(id) {
    api.put(`/api/list/${id}`, { packing_title: this.state.title }).catch(logError);
  }
  toggleChecked(id) {
    const checked = !this.state.checked;
    this.setState({ checked });
    api.put(`/api/list/check/${id}`, { checked }).catch(logError);
  }
  deleteItem(id) {
    this.setState({ deleted: true });
    api.delete(`/api/list/${id}`).catch(logError);
  }

  render() {
    const { id, title, checked, deleted } = this.state;
    // Edit mode comes from the widget's edit button.
    const { editMode } = this.props;
    const themeColor = { backgroundColor: `rgb(${this.props.color})` };
    const checkBox = checked ? (
      <div onClick={() => this.toggleChecked(id)} className="check-box checked" style={themeColor}>
        <i className="fas fa-check"></i>
      </div>
    ) : (
      <div onClick={() => this.toggleChecked(id)} className="check-box unchecked">
        <i className="fas fa-check"></i>
      </div>
    );

    if (deleted) return null;
    return !editMode ? (
      <div className="packing-item">
        <a>{title} </a>
        {checkBox}
      </div>
    ) : (
      <div className="packing-item">
        <input onChange={(e) => this.getTitleInput(e.target.value)} onBlur={() => this.updateTitle(id)} value={title} tabIndex={this.props.tab + 1} maxLength={100} />
        <button className="list-delete" onClick={() => this.deleteItem(id)} aria-label="Delete item">
          <i className="fas fa-trash-alt"></i>
        </button>
        {checkBox}
      </div>
    );
  }
}

export default PackingItem;
