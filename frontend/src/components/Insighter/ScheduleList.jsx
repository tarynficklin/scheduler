import React, { Component } from 'react';
import ScheduleItem from './ScheduleItem';
import api from '../../lib/api';
import './ScheduleList.css';

export default class ScheduleList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scheduleItems: [],
      edit_mode: false,
    };
    this.toggleEditMode = this.toggleEditMode.bind(this);
  }

  componentDidMount() {
    if (this.isSelected()) this.loadItems();
  }

  // Reload the items whenever this day becomes the selected one.
  componentDidUpdate(prevProps) {
    const becameSelected = this.isSelected() && (prevProps.currentSchedule !== this.props.currentSchedule || prevProps.id !== this.props.id);
    if (becameSelected) this.loadItems();
  }

  isSelected() {
    return this.props.id === this.props.currentSchedule;
  }

  loadItems() {
    api
      .get(`/api/schedule/item/${this.props.id}`)
      .then((results) => this.setState({ scheduleItems: results.data }))
      .catch((err) => console.error(err));
  }

  async addScheduleItem() {
    try {
      const results = await api.post(`/api/schedule/item`, {
        schedule_id: this.props.id,
        item_title: 'New Schedule Item',
        item_price: 0,
        item_time: 'morning',
      });
      this.setState({ scheduleItems: [...this.state.scheduleItems, results.data] });
    } catch (err) {
      console.error(err);
    }
  }

  toggleEditMode() {
    this.setState({ edit_mode: !this.state.edit_mode });
  }

  render() {
    const { scheduleItems, edit_mode } = this.state;
    const themeColor = { backgroundColor: `rgb(${this.props.color})` };
    if (!this.isSelected()) return null;
    return (
      <div>
        {scheduleItems.length === 0 ? <a className="empty-schedule">Add new item</a> : null}
        <div className="schedule-list">
          {scheduleItems.map((e) => (
            <ScheduleItem
              key={e.item_id}
              id={e.item_id}
              title={e.item_title}
              price={e.item_price}
              time={e.item_time}
              checked={e.item_checked}
              editMode={edit_mode}
              color={this.props.color}
            />
          ))}
          <button onClick={() => this.addScheduleItem()} style={themeColor} className="new-item" aria-label="Add item">
            <i className="fas fa-plus"></i>
          </button>
        </div>
      </div>
    );
  }
}
