
import React, { useState, createRef, useEffect } from 'react';
import Spinner from '../../UI/Spinner';
import DataGrid, {
  Column,
  Grouping,
  GroupPanel,
  RowDragging,
  SearchPanel,
  Editing,
  Summary, 
  Sorting,
  RequiredRule,
  TotalItem,
  GroupItem,
  Button,
  SortByGroupSummaryInfo,
  LoadPanel,
  Lookup
} from 'devextreme-react/data-grid';
import CheckBox from 'devextreme-react/check-box';
import TextField from '@material-ui/core/TextField';
import ColorBox from 'devextreme-react/color-box';
import axios from 'axios';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Grid from '@material-ui/core/Grid';

const ProductionScheduleChart = (props) => {
    const { data, shopInfo, handleUpdate, handleShopUpdate, handleShopDelete, rowRemoved, onRowInit } = props;
    const [ loaded, setLoaded ] = useState(false);
    const [ expanded, setExpanded ] = useState(true);
    const [ shops, setShops ] = useState(shopInfo);
    
    useEffect(() => {
        data && setLoaded(true);
    }, [ data ])

    const onReorder = (e) => {
        const visibleRows = e.component.getVisibleRows();
        const newTasks = [...data];
        const toIndex = newTasks.indexOf(visibleRows[e.toIndex].data);
        const fromIndex = newTasks.indexOf(e.itemData);

        newTasks.splice(fromIndex, 1);
        newTasks.splice(toIndex, 0, e.itemData);

        let shop = data[toIndex];

        // e.itemData.shop = shop.shop;
        e.itemData.groupIndex = shop.groupIndex;

        handleUpdate(e.itemData);
    }

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
        <div style={{padding: '10px'}}>
          <TextField id="jobName" type="text" size="small" label="Job Name" variant="outlined" onChange={e => data.data.jobName = e.target.value}/>
          <TextField id="wallType" type="text" size="small" label="Wall Type" variant="outlined" onChange={e => data.data.wallType = e.target.value}/>
        </div>
      )
    }

    const renderRow = (row) => {
      if (row.rowType === "data") {
        if (!row.data.booked) {
          row.rowElement.style.backgroundColor = "cyan";
        } else if (row.data.header) {
          row.rowElement.style.backgroundColor = "#a8a8a8";
        } 
      } 
      else if (row.rowType === "group") {
          let colorEntry = shopInfo.find(shop => shop.shop === row.data.key);
          row.rowElement.style.backgroundColor = colorEntry ? colorEntry.colorkey : "white";
          row.rowElement.style.color = colorEntry ? colorEntry.fontColor : "black";
      } 
      else if (row.rowType === "total") {
        row.rowElement.style.backgroundColor = "";
      }
    }

    const jobNumberRender = (row) => {
      if (!row.data.booked) {
        row.data.jobNumber = "Could book in 90 days";
        row.column.allowEditing = false;
      } else if (row.data.booked && row.data.jobNumber === "Could book in 90 days") {
        row.data.jobNumber = "";
        row.column.allowEditing = true;
      }
      return row.data.jobNumber;
    }

    const cellPrepared = (cell) => {
      if ((cell.rowType === "data" && !cell.data.stickwall && (cell.column.dataField === "weeks" || cell.column.dataField === "offset" || cell.column.dataField === "end"))) {
        cell.cellElement.style.backgroundColor = "#c2c4c4";
      }
      else if (cell.rowType === "data" && cell.data.stickwall && ["end", "offset", "units", "unitsPerWeek"].includes(cell.column.dataField)) {
        cell.cellElement.style.backgroundColor = "#c2c4c4";
        cell.text = "";
      }
    }

    const editingStart = (cell) => {
      if (cell.data.stickwall && ["end", "offset", "units", "unitsPerWeek"].includes(cell.column.dataField)) {
        cell.cancel = true;
      } else if (!cell.data.stickwall && ["end", "offset", "weeks"].includes(cell.column.dataField)){
        cell.cancel = true;
      } else {
        cell.cancel = false;
      }
    }

    const onShopReorder = (e) => {
      const itemData = e.itemData;
      const from = e.fromIndex;
      const to = e.toIndex;

      const newShops = [...shops];

      newShops.splice(from, 1);
      newShops.splice(to, 0, itemData);

      setShops(newShops);

      axios.put("https://ww-production-schedule-default-rtdb.firebaseio.com/data/shops.json", newShops)
      .then(response => {})
      .catch(error => console.log(error))

      data.forEach(job => {
        job.groupIndex = newShops.findIndex(shop => shop.shop === job.shopName);
        handleUpdate(job);
      });

    }

    const onShopRowInit = (row) => {
      row.data.shop = "";
      row.data.fontColor = "#000";
      row.data.colorkey = "#fff";
      row.data.id = row.data.__KEY__;
      row.data.index = shops.length;
    }

    return (
    <div>
      {loaded 
        ? <div>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography>Adjust Shop Settings</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container direction="column">
                <Grid item>
                  <CheckBox 
                    text="Expand Rows"
                    value={expanded}
                    onValueChanged={() => setExpanded(!expanded)} 
                    style={{ marginBottom: '20px' }}
                  />
                </Grid>
                <Grid item>
                  <DataGrid
                    dataSource={shops}
                    showRowLines
                    showBorders
                    allowColumnResizing
                    columnAutoWidth
                    highlightChanges
                    repaintChangesOnly
                    twoWayBindingEnabled
                    columnResizingMode="nextColumn"
                    wordWrapEnabled
                    autoExpandAll
                    highlightChanges
                    cellHintEnabled
                    onRowInserted={handleShopUpdate}
                    onRowUpdated={handleShopUpdate}
                    onRowDeleted={handleShopDelete}
                    onInitNewRow={onShopRowInit}

                  >
                    <Editing
                      mode="cell"
                      allowUpdating
                      allowAdding
                      allowDeleting
                      useIcons
                    />

                    <RowDragging
                      allowReordering
                      onReorder={onShopReorder}
                      showDragIcons
                    />

                    <Column type="buttons">
                      <Button name="delete" />
                    </Column>

                    <Column
                      dataField="shop"
                      caption="Shop"
                    />
                    <Column
                      dataField="colorkey"
                      caption="Colorkey for Shop"
                      cellRender={cell => {
                        return ( <ColorBox
                          applyValueMode="instantly"
                          defaultValue={cell.data.colorkey}
                          readOnly
                        /> )
                      }}
                      editCellRender={cell => {
                        return <ColorBox
                          defaultValue={cell.data.colorkey}
                          onValueChange={color => {
                            cell.data.colorkey = color;
                            axios.put(`https://ww-production-schedule-default-rtdb.firebaseio.com/data/shops.json`, shops)
                            .then(response => {
                              let mode = expanded;
                              setExpanded(!mode);
                              setExpanded(mode);
                            }) 
                            .catch(error => alert(error))
                          }}
                        /> 
                      }}
                    />
                    <Column
                      dataField="fontColor"
                      caption="Font Color for Shop"
                      cellRender={cell => {
                        return ( <ColorBox
                          applyValueMode="instantly"
                          defaultValue={cell.data.fontColor}
                          readOnly
                        /> )
                      }}
                      editCellRender={cell => {
                        return <ColorBox
                          defaultValue={cell.data.fontColor}
                          onValueChange={color => {
                            cell.data.fontColor = color;
                            axios.put(`https://ww-production-schedule-default-rtdb.firebaseio.com/data/shops.json`, shops)
                            .then(response => {
                              let mode = expanded;
                              setExpanded(!mode);
                              setExpanded(mode);
                            }) 
                            .catch(error => alert(error))
                          }}
                        /> 
                      }}
                    />
                  </DataGrid>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

          
          <DataGrid
            dataSource={data}
            showRowLines
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
            onCellPrepared={cellPrepared}
            onEditingStart={editingStart}
          >

            <SearchPanel visible highlightCaseSensitive={false} />
            <Grouping autoExpandAll={expanded} />
            <LoadPanel enabled />
            <GroupPanel visible />

            <Editing
              mode="cell"
              allowUpdating
              allowDeleting
              allowAdding
              useIcons
              allowSorting
            />

            {/* <RowDragging
              // allowReordering
              // onReorder={onReorder}
              showDragIcons
            /> */}

            <Column type="buttons">
              <Button name="edit" />
              <Button name="delete" />
            </Column>

            <Column 
              dataField="shopName" 
              groupIndex={0} 
              // dataType="string"
              allowSorting={false}
              calculateGroupValue={row => {
                return row.shop;
              }}
            />

            <Column dataField="shop" caption="Shop" minWidth={100}>
              <Lookup 
                dataSource={shops} 
                displayExpr="shop" 
                valueExpr="shop"
              />
            </Column>

            <Column
              dataField="booked" 
              alignment="center"
              dataType="boolean"
            />

            <Column
              dataField="stickwall" 
              alignment="center"
              dataType="boolean"
            />

            <Column
              dataField="jobNumber" 
              dataType="string"
              caption="Job Number" 
              alignment="center" 
              defaultSortOrder="asc"
              cellRender={jobNumberRender} >
              {/* <RequiredRule /> */}
            </Column>
            <Column 
              dataField="jobName" 
              dataType="string"
              caption="Job Name & Wall Type" 
              cellRender={jobWallCell} 
              editCellRender={editJobWallCell} 
              alignment="left">
              {/* <RequiredRule /> */}
            </Column>
            <Column
              dataField="customer" 
              dataType="string"
              caption="Customer" 
              alignment="center" >
              {/* <RequiredRule /> */}
            </Column>
            <Column 
              dataField="unitsPerWeek" 
              dataType="number"
              caption="Units/Week" 
              alignment="center" 
              calculateCellValue={row => row.stickwall ? "" : row.unitsPerWeek}
            >
              {/* <RequiredRule /> */}
            </Column>
            <Column
              allowSorting 
              dataField="start" 
              dataType="date"
              caption="Shop Start Date" 
              alignment="center">
              {/* <RequiredRule /> */}
            </Column>
            <Column
              allowSorting 
              dataField="weeksToGoBack" 
              dataType="number"
              caption="Weeks To Go Back" 
              alignment="center">
              {/* <RequiredRule /> */}
            </Column>
            <Column 
              dataField="end" 
              caption="End Date" 
              alignment="center" 
              allowEditing={false}
              calculateCellValue={row => {
                let time = row.weeks * 7 * 24 * 60 * 60 * 1000;
                time = row.start && row.start.getTime() + time;
                row.end = new Date(time);
                return row.end; 
              }} 
            >
            </Column>
            <Column
             dataField="fieldStart" 
             dataType="date"
             cption="Field Start Date" 
             alignment="center" >
              {/* <RequiredRule /> */}
            </Column>
            <Column 
              dataField="units" 
              dataType="number"
              caption="Units" 
              alignment="center"
              calculateCellValue={row => row.stickwall ? "" : row.units}
            >
              {/* <RequiredRule /> */}
            </Column>
            <Column 
              dataField="emps" 
              dataType="number"
              caption="Emps" 
              alignment="center">
              {/* <RequiredRule /> */}
            </Column>
            
            <Column 
              dataField="weeks" 
              caption="Weeks" 
              alignment="center"
            ></Column>
            <Column 
              dataField="offset" 
              caption="Offset" 
              alignment="center"
            ></Column>
            
            <Summary recalculateWhileEditing>
              <GroupItem
                column="units"
                summaryType="sum"
                name="shopUnits"
                customizeText={data => `Total Units: ` + data.value}
              />
              <GroupItem
                column="emps"
                summaryType="sum"
                name="shopEmps"
                customizeText={data => `Total Emps: ` + data.value}
              />
              <GroupItem
                column="unitsPerWeek"
                summaryType="sum"
                name="shopUnitsPerWeek"
                customizeText={data => `Total Units/Week: ` + data.value}
              />
              <GroupItem
                column="groupIndex"
                summaryType="avg"
                name="groupIndex"
                customizeText={data => data.value}
              />

              <TotalItem
                column="units"
                summaryType="sum"
                customizeText={data => `Total Units: ` + data.value.toLocaleString()}
              />
              <TotalItem
                column="unitsPerWeek"
                summaryType="sum"
                customizeText={data => `Total Units/Week: ` + data.value.toLocaleString()}
              />
              <TotalItem
                column="emps"
                summaryType="sum"
                customizeText={data => `Total Emps: ` + data.value.toLocaleString()}
              />
            </Summary>

            {/* <SortByGroupSummaryInfo 
                summaryItem="groupIndex"
            /> */}
          </DataGrid>
        </div>
      : <Spinner />
      }
      </div>
    );
}

export default ProductionScheduleChart;
