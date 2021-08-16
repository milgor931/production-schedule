
import React, { useState, useEffect } from 'react';
import ProductionScheduleChart from './PS_Chart.js';
import Graph from './PS_Graph.js';
import Spinner from '../../UI/Spinner';
import DG_Grantt from './PS_DG_Gantt';
import Grid from '@material-ui/core/Grid';
import Radio from '@material-ui/core/Radio';

const ProductionSchedule = (props) => {
    const { shops, jobs, handleUpdate, handleShopUpdate, handleShopDelete, rowRemoved, onRowInit, toMS, toDays } = props;
    const [ tabs, setTabs ] = useState([]);
    const [ loaded, setLoaded ] = useState(false);
    const [ selectedIndex, setSelectedIndex ] = useState(0);

    useEffect(() => {

        setTabs([
            {
                'ID': 0,
                'name': 'Gantt',
                'component': <DG_Grantt
                                data={jobs} 
                                shops={shops}
                                handleUpdate={handleUpdate}
                                toMS={toMS}
                                toDays={toDays}
                            />
            },
            {
                'ID': 1,
                'name': 'Production Schedule',
                'component': <ProductionScheduleChart 
                                data={jobs} 
                                shopInfo={shops}
                                handleUpdate={handleUpdate}
                                handleShopUpdate={handleShopUpdate}
                                handleShopDelete={handleShopDelete}
                                rowAdded={handleUpdate}
                                rowRemoved={rowRemoved}
                                onRowInit={onRowInit}
                                toMS={toMS}
                                toDays={toDays}
                            />
            }, 
            {
                'ID': 2,
                'name': 'Units Graph',
                'component': <Graph 
                                data={jobs} 
                                handleUpdate={handleUpdate}
                                toMS={toMS}
                                toDays={toDays}
                            />
            }
        ])

        setLoaded(true);

    }, [ jobs ])
    
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
        <div style={{margin: '3vw'}}>
        { loaded
            ? 
            <div style={{alignItems: 'center', justifyContent: 'center'}}>
                <Grid container style={{marginTop: '20px'}} direction="row" alignItems="center" justifyContent="center">
                    {inputs}
                </Grid>

                <div> {jobs && tabs[selectedIndex].component} </div>
            </div>
            : 
            <Spinner />
        }
        </div>
    );
}

export default ProductionSchedule;