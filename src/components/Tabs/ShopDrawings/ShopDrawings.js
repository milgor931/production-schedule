
import React, { useState, useEffect } from 'react';
import Spinner from '../../UI/Spinner';
import DataGrid, {
  Column,
  Grouping,
  GroupPanel,
  SearchPanel,
  Editing
} from 'devextreme-react/data-grid';
import axios from 'axios';

const ShopDrawings = (props) => {
    const { rows, headers } = props;
    const [ loaded, setLoaded ] = useState(true);

    return (
    <div>
      { loaded 
        ?   <div style={{margin: '3vw'}}>
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
                autoExpandAll
                highlightChanges
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
                    // editCellRender={ cell => {
                    //     <FormControl variant="outlined">
                    //         <InputLabel id="demo-simple-select-outlined-label">Job Name</InputLabel>
                    //         <Select
                    //             labelId="demo-simple-select-outlined-label"
                    //             id="demo-simple-select-outlined"
                    //             value={cell.data.header}
                    //             onChange={e => cell.data.header = e.target.value}
                    //             label="Job"
                    //         >
                    //             { jobs.map(job => <MenuItem key={job.jobName} value={job.jobName}> {job.jobName} </MenuItem>) }
                    //         </Select>
                    //     </FormControl>
                    //     }
                    // }
                />
            )}
        
          </DataGrid>
        </div>
      : <Spinner />
      }
      </div>
    );
}

export default ShopDrawings;
