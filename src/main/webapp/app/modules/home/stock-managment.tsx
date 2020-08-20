import React,{useState, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import{ Paper, Grid, Typography, Box} from '@material-ui/core';
import config from './config';
import Product from './product';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: 'white',
    background: '#2A6A9E',
    paddingTop: '10%',
    paddingBottom: '10%',
    transition: 'background-color 0.5s ease',
    '&:hover':{
        background: '#81d4fa',
        color: 'black',
        cursor: 'pointer',
    },
  },
  title:{
    textAlign: 'center',
    padding: '5%',
  },
  gridContainer: {
    textAlign: 'center',
    marginTop: '20px',
    marginBottom: '20px',
  },
}));

const StockManagment = ()=>{

    const classes = useStyles();

    const [showAviable, setShowAviable] = useState(null);
    const [showInCharge, setshowInCharge] = useState(null);
    const [showBroken, setshowBroken] = useState(null);

    const [bucketList, setBucketList] = useState([]);

    const getBuckets = async () =>{
        try{
            const bucketsData =  await fetch("http://localhost:9000/api/product-buckets",{
                method: 'get', 
                headers: new Headers({
                'Authorization': `Bearer ${config.authToken}`, 
                'Content-Type': 'application/json; charset=UTF-8'
                })
            });
            const bucketsJson = await bucketsData.json();
            setBucketList(bucketsJson);
        }catch(error){
            console.error(error);
        }
    };

    useEffect(()=>{
        getBuckets();
    }, []);

    return(
        <div className={classes.root}>  
            <Grid xs={12} className={classes.title}>
                <Typography variant="h2" color="primary" >Control de Stock</Typography>
            </Grid>

             <Grid container spacing={3}>
                
                <Grid item xs={4}>
                    <Paper className={classes.paper} onClick={()=>{setShowAviable(true); setshowInCharge(false); setshowBroken(false)}}>Disponible</Paper>
                </Grid>
                <Grid item xs={4}>
                    <Paper className={classes.paper} onClick={()=>{setShowAviable(false); setshowInCharge(true); setshowBroken(false)}}>Encargado</Paper>
                </Grid>
                <Grid item xs={4}>
                    <Paper className={classes.paper} onClick={()=>{setShowAviable(false); setshowInCharge(false); setshowBroken(true)}}>Roto</Paper>
                </Grid>
            
            </Grid>

            {!showAviable && !showInCharge && !showBroken ? (
                <Grid xs={12} className={classes.title}>
                    <Typography variant="h5" color="primary" >Seleccione una opción para ver el estados de sus productos.</Typography>    
                </Grid>
            ) : (
                showAviable ? (
                    <Box m={4}>
                        <Grid container spacing={3} className={classes.gridContainer}>
                            <Grid item xs={3}>
                                <Typography variant="subtitle1">Producto</Typography>    
                            </Grid>
                            <Grid item xs={3}>
                                <Typography variant="subtitle1">Unidades Disponibles</Typography>    
                            </Grid>
                            <Grid item xs={3}>
                                <Typography variant="subtitle1">Unidades Seleccionadas</Typography>    
                            </Grid>
                            <Grid item xs={3}>
                                    
                            </Grid>
                            
                        </Grid>

                        {bucketList.map((bucketItem) => <Product key={`aviable-${bucketItem.id}`} bucket={bucketItem} quantityType={config.bucketType.aviable}></Product>)}
                    </Box>
                    
                ):(
                    showInCharge ? (
                        <Box m={4}>
                            <Grid container spacing={3} className={classes.gridContainer}>
                                <Grid item xs={3}>
                                    <Typography variant="subtitle1">Producto</Typography>    
                                </Grid>
                                <Grid item xs={3}>
                                    <Typography variant="subtitle1">Unidades Encargadas</Typography>    
                                </Grid>
                                <Grid item xs={3}>
                                    <Typography variant="subtitle1">Unidades Seleccionadas</Typography>    
                                </Grid>
                                <Grid item xs={3}>
                                        
                                </Grid>

                            </Grid>

                            {bucketList.map((bucketItem) => <Product key={`in-charge-${bucketItem.id}`} bucket={bucketItem} quantityType={config.bucketType.inCharge}></Product>)}
                        </Box>
                    ):(
                        <Box m={4}>
                            <Grid container spacing={3} className={classes.gridContainer}>
                                <Grid item xs={3}>
                                    <Typography variant="subtitle1">Producto</Typography>    
                                </Grid>
                                <Grid item xs={3}>
                                    <Typography variant="subtitle1">Unidades Rotas</Typography>    
                                </Grid>
                                <Grid item xs={3}>
                                    <Typography variant="subtitle1">Unidades Seleccionadas</Typography>    
                                </Grid>
                                <Grid item xs={3}>
                                        
                                </Grid>
                                
                            </Grid>
                            {bucketList.map((bucketItem) => <Product key={`broken-${bucketItem.id}`} bucket={bucketItem} quantityType={config.bucketType.broken}></Product>)}
                        </Box>
                    )
                )
            )}
            
        </div>
    )
};

export default StockManagment;