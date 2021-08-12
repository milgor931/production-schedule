
import React, { useState, createRef, useEffect } from 'react';
import Spinner from '../../UI/Spinner';
import DataGrid, {
  Column,
  Grouping,
  GroupPanel,
  Pager,
  Paging,
  RowDragging,
  SearchPanel,
  Editing,
  Summary, 
  Sorting,
  RequiredRule,
  TotalItem,
  MasterDetail,
  GroupItem,
  Button,
  FilterRow, 
  RemoteOperations
} from 'devextreme-react/data-grid';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';


const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  blueColumn: {
      backgroundColor: "#00c7d9",
      color: 'white'
  }
}));

const GlassGasket = (props) => {
    const { data, handleUpdate, rowRemoved, onRowInit } = props;
    const [ loaded, setLoaded ] = useState(true);
    const classes = useStyles();

    const renderRow = (row) => {
      if (row.rowType === "data") {
        if (!row.data.booked) {
          row.rowElement.style.backgroundColor = "cyan";
        } else if (row.data.header) {
          row.rowElement.style.backgroundColor = "#a8a8a8";
        }
      } 
    }

    return (
    <div style={{margin: '3vw'}}>
      {loaded 
        ? <div>
          <DataGrid
            dataSource={data}
            showBorders
            showRowLines
            allowColumnResizing
            columnAutoWidth
            highlightChanges
            repaintChangesOnly
            twoWayBindingEnabled
            columnResizingMode="nextColumn"
            wordWrapEnabled
            autoExpandAll
            highlightChanges
            onInitNewRow={onRowInit}
            // onInitialized={onRowInit}
            onRowUpdated={handleUpdate}
            onRowInserted={handleUpdate}
            onRowRemoved={rowRemoved}
            // onCellPrepared={cellPrepared}
            onRowPrepared={renderRow}
            cellHintEnabled

          >

            <GroupPanel visible={false} autoExpandAll/>
            <SearchPanel visible highlightCaseSensitive={false} />
            <Grouping autoExpandAll />
            {/* <FilterRow visible={true} /> */}
            <Sorting mode="multiple" />

            <Editing
              mode="batch"
              allowUpdating
              useIcons
              allowSorting
            />

            {/* <Column type="buttons">
                <Button name="delete" />
            </Column> */}

            <Column
                dataField="jobNumber" 
                dataType="string"
                caption="Job Number" 
                alignment="center" 
                fixed
            >
                <RequiredRule />
            </Column>

            <Column 
                dataField="jobName" 
                dataType="string"
                caption="Job Name" 
                alignment="left"
                fixed
            >
                    <RequiredRule />
            </Column>

            <Column
                dataField="orderWeekOf"
                dataType="date"
                caption="Order Week Of"
                alignment="center"
            >
                <RequiredRule />
            </Column>

            <Column
                dataField="glassRequired"
                dataType="date"
                caption="Glass Required"
                alignment="center"
            >
                <RequiredRule />
            </Column>

            <Column
                dataField="numberOfLites"
                // dataType=""
                caption="# Of Lites"
                alignment="center"
            >
                <RequiredRule />
            </Column>

            <Column
                dataField="sqft"
                // dataType="date"
                caption="Square Footage"
                alignment="center"
            >
                <RequiredRule />
            </Column>

            <Column
                dataField="vendor"
                dataType="string"
                caption="Vendor"
                alignment="center"
            >
            </Column>

            <Column
                dataField="lbs"
                dataType="number"
                caption="Lbs, K"
                alignment="center"
            >
            </Column>

            <Column
                dataField="gasket"
                // dataType="boolean"
                caption="Gasket"
                alignment="center"
                calculateDisplayValue={cell => cell.gasket && `$ ${cell.gasket}`}
            >
            </Column>

            <Column
                dataField="coating"
                dataType="string"
                caption="Coating"
                alignment="center"
            >
            </Column>

            <Column
                dataField="pgtTransferred"
                dataType="boolean"
                caption="PGT Transferred"
                alignment="center"
            >
            </Column>

            <Column
                dataField="bookingPO"
                dataType="string"
                caption="Booking PO"
                alignment="center"
            >
            </Column>

            <Column
                dataField="pgtComplete"
                dataType="string"
                caption="PGT Complete"
                alignment="center"
            >
            </Column>           
          </DataGrid>
        </div>
      : <Spinner />
      }
      </div>
    );
}

export default GlassGasket;
