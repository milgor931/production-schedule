
import React from 'react';
import DataGrid, {
    Column,
    Grouping,
    GroupPanel,
    SearchPanel,
    Editing,
    Sorting,
} from 'devextreme-react/data-grid';

const GlassGasket = (props) => {
    const { data, handleUpdate, toMS, toWeeks } = props;

    const jobs = data.jobs ? data.jobs : [];

    const renderRow = (row) => {
        if (row.rowType === "data" && !row.data.booked) {
            row.rowElement.style.backgroundColor = "cyan";
        } else if (row.rowType === "data" && row.data.booked && row.data.engineering) {
            row.rowElement.style.backgroundColor = "#edada6";
        }
    }

    const orderWeekRender = (row) => {
        row.data.orderWeekOffset = toWeeks(row.data.start, row.data.orderWeekOf);
        return (
            <div>
                {row.data.orderWeekOf && row.data.orderWeekOf.toLocaleDateString()}
                <br />
                {<p style={{ color: "#3f50b5" }}> {row.data.orderWeekOffset} weeks after shop start </p>}
            </div>
        )
    }

    const orderWeekEdit = (row) => {
        let link = row.data.orderLinkToShop;
        return (
            <div>
                {link
                    ? <input
                        placeholder="weeks after shop start"
                        onChange={e => {
                            let weeks = e.target.value;
                            let date = new Date(row.data.start.getTime() + toMS(weeks * 7));
                            row.setValue(date);
                        }}
                    />
                    : <input
                        type="date"
                        onChange={e => {
                            let d = new Date(e.target.value);
                            d.setTime(d.getTime() + d.getTimezoneOffset() * 60 * 1000);
                            row.setValue(d);
                        }}
                    />
                }
            </div>
        )
    }

    const rowUpdatedHandler = (rowData) => {
        const newData = { ...data, jobs: jobs };

        rowData.component.beginCustomLoading();
        handleUpdate(newData).then((response) => {
            rowData.component.endCustomLoading();
        });
    }

    return (
        <div style={{ margin: '3vw' }}>

            <DataGrid
                dataSource={jobs}
                showBorders
                showRowLines
                allowColumnResizing
                columnAutoWidth
                highlightChanges
                repaintChangesOnly
                twoWayBindingEnabled
                columnResizingMode="widget"
                wordWrapEnabled
                autoExpandAll
                highlightChanges
                onRowUpdated={rowUpdatedHandler}
                onRowPrepared={renderRow}
                cellHintEnabled
            >

                <GroupPanel visible={false} autoExpandAll />
                <SearchPanel visible highlightCaseSensitive={false} />
                <Grouping autoExpandAll />
                <Sorting mode="multiple" />

                <Editing
                    mode="cell"
                    allowUpdating
                    useIcons
                    allowSorting
                />

                <Column
                    dataField="jobNumber"
                    dataType="string"
                    caption="Job Number"
                    alignment="center"
                    fixed
                >
                </Column>

                <Column
                    dataField="jobName"
                    dataType="string"
                    caption="Job Name"
                    alignment="left"
                    fixed
                >
                </Column>

                <Column
                    dataField="orderLinkToShop"
                    caption="Link To Shop Start?"
                    dataType="boolean"
                    calculateCellValue={row => row.orderLinkToShop ? row.orderLinkToShop : false}
                />

                <Column
                    dataField="orderWeekOf"
                    dataType="date"
                    caption="Order Week Of"
                    alignment="center"
                    minWidth="160"
                    cellRender={orderWeekRender}
                    editCellRender={orderWeekEdit}
                >
                </Column>

                <Column
                    dataField="glassRequired"
                    dataType="date"
                    caption="Glass Required"
                    alignment="center"
                >
                </Column>

                <Column
                    dataField="numberOfLites"
                    // dataType=""
                    caption="# Of Lites"
                    alignment="center"
                >
                </Column>

                <Column
                    dataField="sqft"
                    // dataType="date"
                    caption="Square Footage"
                    alignment="center"
                >
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
                    calculateCellValue={row => row.pgtTransferred ? row.pgtTransferred : false}
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
    );
}

export default GlassGasket;
