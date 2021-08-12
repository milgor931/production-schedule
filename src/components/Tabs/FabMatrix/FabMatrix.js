
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
    const { rows, headers } = props;
    const [ data, setData] = useState([]);
    const [ loaded, setLoaded ] = useState(true);

    return (
    <div style={{margin: '3vw'}}>
      {loaded 
        ? <div>
          <DataGrid
            dataSource={rows}
            showBorders
            showRowLines
            allowColumnResizing
            columnAutoWidth
            highlightChanges
            repaintChangesOnly
            twoWayBindingEnabled
            columnResizingMode="nextColumn"
            wordWrapEnabled
            // onRowUpdated={handleUpdate}
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
