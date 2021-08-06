
import React, { useState, useEffect } from 'react';
import Spinner from '../../UI/Spinner';
import DataGrid, {
  Column,
  Grouping,
  GroupPanel,
  SearchPanel,
  Editing,
  Button
} from 'devextreme-react/data-grid';
import axios from 'axios';

const FabMatrix = (props) => {
    const [ data, setData] = useState([]);
    const [ loaded, setLoaded ] = useState(false);
    const [ headers, setHeaders ] = useState([]);

    useEffect(() => {
        axios.get("https://ww-production-schedule-default-rtdb.firebaseio.com/fabmatrix/headers.json")
        .then(response => {
            response.data ? setHeaders(Object.values(response.data)) : setHeaders([]);
            setLoaded(true);
        })
        .catch(error => console.log(error))

        axios.get(`https://ww-production-schedule-default-rtdb.firebaseio.com/fabmatrix/data.json`)
        .then(response => {
            response.data ? setData(Object.values(response.data)) : createRows();
        })
        .catch(error => console.log(error))

    }, [])

    const createRows = () => {
        let rows = [];
        let weeks = 100;

        for (let i = 0; i < weeks; i++) {
            let today = new Date();
            today = today.getTime() + toMilliseconds( 1 - today.getDay() );

            let date = today + toMilliseconds(i*7);

            date = new Date(date).toLocaleDateString();
            let obj = {
                date: date,
            }

            rows.push(obj);
        }
        setData(rows);

        axios.put(`https://ww-production-schedule-default-rtdb.firebaseio.com/fabmatrix/data.json`, rows)
        .then(response => response.data)
        .catch(error => alert(error))
    }

    const handleUpdate = (row) => {
        axios.put(`https://ww-production-schedule-default-rtdb.firebaseio.com/fabmatrix/data/${row.data.id}.json`, row.data)
        .then(response => response.data)
        .catch(error => alert(error))
    }

    const toMilliseconds = (days) => {
        return days * 24 * 60 * 60 * 1000;
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
            onRowUpdated={handleUpdate}
          >

            <GroupPanel visible={false} autoExpandAll/>
            <SearchPanel visible highlightCaseSensitive={false} />
            <Grouping autoExpandAll />

            <Editing
              mode="batch"
              allowUpdating
              useIcons
              allowSorting={false}
            />

            <Column
                dataField="date"
                fixedPosition="left"
                caption="Date"
                alignment="left"
                width={"auto"}
                allowEditing={false}
            />

            {headers.map((header, index) => 
                <Column
                    key={index}
                    dataField={header.employee}
                    caption={header.employee}
                />
            )}
        
          </DataGrid>
        </div>
      : <Spinner />
      }
      </div>
    );
}

export default FabMatrix;
