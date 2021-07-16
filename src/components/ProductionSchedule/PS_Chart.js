
import React, { useState, createRef, useEffect } from 'react';
import Spinner from '../Spinner';
import CheckBox from "devextreme/ui/check_box";
import DataGrid, {
  Column,
  Grouping,
  GroupPanel,
  Pager,
  Paging,
  SearchPanel,
  Editing,
  Summary, 
  TotalItem,
  MasterDetail,
  GroupItem,
  RemoteOperations
} from 'devextreme-react/data-grid';
import axios from "axios";

const ProductionScheduleChart = (props) => {
    const { data, handleUpdate, rowAdded, rowRemoved, onRowInit } = props;
    const [ loaded, setLoaded ] = useState(false);
    const [ startDate, setStartDate ] = useState();

    useEffect(() => {
      data && setLoaded(true);
    }, [ data ])

    const jobWallCell = (data) => {
      return (
        <div>
          <span>{data.data.jobName}</span>
          <br></br>
          <span style={{color: "#5a87d1"}}>{data.data.wallType}</span>
        </div>
      )
    }

    const editJobWallCell = (data) => {
      return (
        <div>
          <input type="text" placeholder={data.data.jobName} name={data.data.jobName} onChange={e => data.data.jobName = e.target.value}/>
          <br></br>
          <input type="text" placeholder={data.data.wallType} name={data.data.wallType} onChange={e => data.data.wallType = e.target.value}/>
        </div>
      )
    }

    const renderRow = (row) => {
      if (row.rowType === "data") {
        if (!row.data.booked) {
          row.rowElement.style.backgroundColor = "#9cf5ff";
        } else if (row.data.header) {
          row.rowElement.style.backgroundColor = "#a8a8a8";
        }
      } 
    }

    return (
    <div style={{margin: '50px'}}>
      {loaded 
        ? <div>
          <DataGrid
            dataSource={data}
            showBorders
            allowColumnResizing
            columnAutoWidth
            highlightChanges
            repaintChangesOnly
            onRowPrepared={renderRow}
            twoWayBindingEnabled
            columnResizingMode="nextColumn"
            wordWrapEnabled
            autoExpandAll
            highlightChanges
            onInitNewRow={onRowInit}
            onRowUpdated={handleUpdate}
            onRowInserted={handleUpdate}
            onRowRemoved={rowRemoved}
          >

            <GroupPanel visible autoExpandAll/>
            <SearchPanel visible highlightCaseSensitive={false} />
            <Grouping autoExpandAll />

            <Editing
              mode="cell"
              allowUpdating
              allowDeleting
              allowAdding
            />

            <Column dataField="shop" groupIndex={0} />
            <Column dataField="booked" alignment="center" />
            <Column dataField="jobName" caption="Job Name & Wall Type" cellRender={jobWallCell} editCellRender={editJobWallCell} alignment="left" />
            <Column dataField="jobNumber" caption="Job Number" alignment="center"/>
            <Column dataField="customer" caption="Customer" alignment="center" />
            <Column dataField="unitsPerWeek" caption="Units/Week" alignment="center" />
            <Column dataField="start" caption="Shop Start Date" alignment="center"/>
            <Column dataField="weeks" caption="Weeks" alignment="center" allowEditing={false}/>
            <Column dataField="end" caption="End Date" alignment="center" allowEditing={false} allowEditing={false}/>
            <Column dataField="fieldStart" cption="Field Start Date" alignment="center" />
            <Column dataField="units" caption="Units" alignment="center"/>
            <Column dataField="emps" caption="Emps" alignment="center"/>
            <Column dataField="offset" caption="Offset" allowEditing={false} alignment="center"/>
            
            <Summary recalculateWhileEditing>
              <GroupItem
                column="units"
                summaryType="sum"
                customizeText={data => `Total Units: ` + data.value}
              />
              <GroupItem
                column="emps"
                summaryType="sum"
                customizeText={data => `Total Emps: ` + data.value}
              />
              <GroupItem
                column="unitsPerWeek"
                summaryType="sum"
                customizeText={data => `Total Units/Week: ` + data.value}
              />
            </Summary>

          </DataGrid>
        </div>
      : <Spinner />
      }
      </div>
    );
}

export default ProductionScheduleChart;
