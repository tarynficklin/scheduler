import React, { Component } from 'react';
import api from '../../lib/api';
import Glass from '../Common/Glass';
import PackingItem from './PackingItem';
import './PackingWidget.css';

class PackingWidget extends Component {
  constructor(props) {
    super(props);
    this.state = {
      packingList: [],
      revealed: false,
      editMode: false,
    };
    this.updateList = this.updateList.bind(this);
  }

  componentDidMount() {
    this.updateList();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.id !== this.props.id) this.updateList();
  }

  updateList() {
    if (!this.props.id) return; // the trip hasn't loaded yet
    api
      .get(`/api/list/${this.props.id}`)
      .then((results) => this.setState({ packingList: results.data }))
      .catch((err) => console.error(err));
  }

  revealWidget() {
    this.updateList();
    this.setState({ revealed: !this.state.revealed });
  }

  toggleEditMode() {
    this.setState({ editMode: !this.state.editMode });
  }

  async addPackingItem() {
    try {
      const results = await api.post(`/api/list`, {
        trip_id: this.props.id,
        packing_title: 'New Item',
      });
      this.setState({ packingList: [...this.state.packingList, results.data] });
    } catch (err) {
      console.error(err);
    }
  }

  render() {
    const { packingList, revealed, editMode } = this.state;
    const themeColor = { backgroundColor: `rgb(${this.props.color})` };

    return (
      <div className="packing-widget widget">
        {revealed ? (
          <Glass
            overlayColor="rgba(255, 255, 255, 0.7)"
            blurAmount="1.6rem"
            className="widget-card"
          >
            <div>
              <div className="list-banner" style={themeColor}>
                <h3>Packing List</h3>
                <button
                  onClick={() => this.addPackingItem()}
                  className="list-add"
                  aria-label="Add item"
                >
                  <i className="fas fa-plus"></i>
                </button>
              </div>
              <div className="list-wrapper">
                <div className="list-items">
                  {packingList.map((e, i) => (
                    <PackingItem
                      key={e.packing_id}
                      tab={i}
                      id={e.packing_id}
                      title={e.packing_title}
                      checked={e.packing_checked}
                      editMode={editMode}
                      color={this.props.color}
                    />
                  ))}
                </div>
              </div>
              <div className="list-banner list-footer" style={themeColor}>
                <button onClick={() => this.toggleEditMode()} aria-label="Edit list">
                  <i className="fas fa-edit"></i>
                </button>
                <button onClick={() => this.revealWidget()} aria-label="Close list">
                  <i className="fas fa-check"></i>
                </button>
              </div>
            </div>
          </Glass>
        ) : null}
        {revealed ? (
          <div className="arrow" style={{ backgroundColor: `rgb(${this.props.color})` }}></div>
        ) : null}
        <button
          onClick={() => this.revealWidget()}
          style={themeColor}
          className="widget-button"
          aria-label="Packing list"
        >
          <i className="fas fa-briefcase"></i>
        </button>
      </div>
    );
  }
}

export default PackingWidget;
