
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
}));

const TakeoffMatrix = (props) => {
    const [ data, setData] = useState([]);
    const [ loaded, setLoaded ] = useState(false);
    const [ headers, setHeaders ] = useState(["Id's Drafting", "Pallet Schedule", "Metal Takeoff", "Glass Takeoff", "Door Schedule", "Shop Use Brakes and Steel", "Mock Ups", "Mock-Up Overflow"])

    useEffect(() => {
        axios.get("https://ww-production-schedule-default-rtdb.firebaseio.com/shopdrawings.json")
        .then(response => {
            response.data ? setData(Object.values(response.data)) : setData([]);
            createRows();
            setLoaded(true);
        })
        .catch(error => {
            alert(error);
        })
    }, [ ])

    const createRows = () => {
        let rows = [];
        for (let i = 0; i < 100; i++) {
            let date = new Date().getTime() + toMilliseconds(i*7);
            date = new Date(date).toLocaleDateString();

            data.forEach(job => {
                rows.push({date: date, start: job.start});
            })
        }
        setData(rows);
    }

    const columns = headers.map(date => 
        <Column
            dataField="employee"
            caption={date}
        />
    )

    const handleUpdate = (row) => {
        if (row.data) {
            row = row.data;
        }
        row.shopName = row.shop;
        row.title = row.jobName;
        axios.put(`https://ww-production-schedule-default-rtdb.firebaseio.com/jobs/${row.id}.json`, row)
        .then(response => {
            setData([ ...data ])
        })
        .catch(error => alert(error))
    }

    const toMilliseconds = (days) => {
        return days * 24 * 60 * 60 * 1000;
    }

    const toDays = (ms) => {
        return Math.ceil( ms / (24 * 60 * 60 * 1000) );
    }

    return (
    <div>
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
            // onInitialized={onRowInit}
            onRowUpdated={handleUpdate}
            // onCellPrepared={cellPrepared}
            cellHintEnabled

          >

            <GroupPanel visible={false} autoExpandAll/>
            <SearchPanel visible highlightCaseSensitive={false} />
            <Grouping autoExpandAll />
            <Sorting mode="multiple" />

            <Editing
              mode="row"
              allowUpdating
              allowDeleting
              allowAdding
              useIcons
              allowSorting={false}
            />

            <Column type="buttons">
                <Button name="edit" />
            </Column>

            <Column
                dataField="date"
                caption=""
                alignment="left"
                width={"auto"}
                allowEditing={false}
            />

            {columns}
        
          </DataGrid>
        </div>
      : <Spinner />
      }
      </div>
    );
}

export default TakeoffMatrix;
