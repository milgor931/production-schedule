import React, { useState, useEffect } from 'react';
import Chart from './PS_Chart';
import Graph from './PS_Graph';
import Gantt from './PS_DG_Gantt';
import Grid from '@material-ui/core/Grid';
import Radio from '@material-ui/core/Radio';

const ProductionSchedule = (props) => {
    const { data, handleUpdate, toMondayDate, addDays, toWeeks } = props;
    const [tabs, setTabs] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(0);

    useEffect(() => {

        setTabs([
            {
                'ID': 0,
                'name': 'Gantt',
                'component': <Gantt
                    data={data}
                    handleUpdate={handleUpdate}
                    toMondayDate={toMondayDate}
                    addDays={addDays}
                    toWeeks={toWeeks}
                />
            },
            {
                'ID': 1,
                'name': 'Production Schedule',
                'component': <Chart
                    data={data}
                    handleUpdate={handleUpdate}
                    toMondayDate={toMondayDate}
                    addDays={addDays}
                    toWeeks={toWeeks}
                />
            },
            {
                'ID': 2,
                'name': 'Units Graph',
                'component': <Graph
                    data={data}
                    handleUpdate={handleUpdate}
                    toMondayDate={toMondayDate}
                    addDays={addDays}
                    toWeeks={toWeeks}
                />
            }
        ])

    }, [ data ])

    const inputs = ["gantt", "chart", "graph"].map((value, index) =>
        <Grid item key={index}>
            <Radio
                checked={selectedIndex === index}
                onChange={e => setSelectedIndex(index)}
                value={index}
                color="primary"
                name="radio-buttons"
                inputProps={{ 'aria-label': index }}
                size="small"
            />
        </Grid>
    )

    return (
        <div style={{ margin: '3vw', alignItems: 'center', justifyContent: 'center' }}>
            <Grid container style={{ marginTop: '20px' }} direction="row" alignItems="center" justifyContent="center">
                {inputs}
            </Grid>

            <div> { tabs[selectedIndex] && tabs[selectedIndex].component} </div>
        </div>
    );
}

export default ProductionSchedule;