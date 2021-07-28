
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

const ShopDrawings = (props) => {
    const [ data, setData] = useState([]);
    const [ loaded, setLoaded ] = useState(false);
    const classes = useStyles();

    useEffect(() => {
        createRows();
        
        axios.get("https://ww-production-schedule-default-rtdb.firebaseio.com/shopdrawings.json")
        .then(response => {
            // response.data ? setData(Object.values(response.data)) : setData([]);
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
            rows.push({date: new Date(date).toLocaleDateString()});
        }
        setData(rows);
    }

    const columns = ["Yana", "Mila", "Steve", "Yana", "Mila", "Steve", "Yana", "Mila", "Steve", "Yana", "Mila", "Steve", "Yana", "Mila", "Steve"].map(date => 
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

    const rowRemoved = (row) => {
        // setData([ Object.assign(data, row.data) ])
        axios.delete(`https://ww-production-schedule-default-rtdb.firebaseio.com/jobs/${row.data.id}.json`)
        .then(response => {
            // setData([ ...data ])
        })
        .catch(error => alert(error))
    }

    const onRowInit = (row) => {
        row.data.booked = false;
        row.data.shop = "";
        row.data.shopName = "";
        row.data.jobName = "job name";
        row.data.title = "job name";
        row.data.wallType = "wall type";
        row.data.start = new Date();
        row.data.fieldStart = new Date();
        row.data.id = row.data.__KEY__;
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
            onInitNewRow={onRowInit}
            // onInitialized={onRowInit}
            onRowUpdated={handleUpdate}
            onRowInserted={handleUpdate}
            onRowRemoved={rowRemoved}
            // onCellPrepared={cellPrepared}
            cellHintEnabled

          >

            <GroupPanel visible={false} autoExpandAll/>
            <SearchPanel visible highlightCaseSensitive={false} />
            <Grouping autoExpandAll />
            {/* <FilterRow visible={true} /> */}
            {/* <Sorting mode="multiple" /> */}

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
                <Button name="delete" />
            </Column>

            <Column
                dataField="date"
                fixedPosition="left"
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

export default ShopDrawings;
