import React,{useState, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import{ Paper, Grid, Typography, Box} from '@material-ui/core';
import config from './config';
import Product from './product';
import BrokenImage from '@material-ui/icons/BrokenImage';
import LocalShipping from '@material-ui/icons/LocalShipping';
import CheckCircle from '@material-ui/icons/CheckCircle';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    width: '70%',
    margin: 'auto',
  },
  gridContainer: {
    textAlign: 'center',
    marginTop: '20px',
    marginBottom: '20px',
  },
  iconPaper:{
    margin: theme.spacing(1),
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
        background: '#5E99C5',
        color: 'white',
        cursor: 'pointer',
    },
    borderRadius: '13px',
  },
  title:{
    textAlign: 'center',
    padding: '5%',
    marginTop: '5%',
    marginBottom: '5%',
  },
}));

const StockManagment = ()=>{

    const classes = useStyles();

    const [showAviable, setShowAviable] = useState(null);
    const [showInCharge, setshowInCharge] = useState(null);
    const [showBroken, setshowBroken] = useState(null);

    const [isUpdated, setIsUpdated] = useState(null);

    const [bucketList, setBucketList] = useState([]);

    const getBuckets = async () =>{
        setIsUpdated(false);
        try{
            const bucketsData =  await fetch("http://localhost:9000/api/product-buckets",{
                method: 'get', 
                headers: new Headers({
                'Authorization': `Bearer ${config.authToken}`, 
                'Content-Type': 'application/json; charset=UTF-8'
                })
            });
            const bucketsJson = await bucketsData.json();

            bucketsJson.sort((a,b)=>{
                return a.id - b.id;
            })

            setBucketList(bucketsJson);
        }catch(error){
            console.error(error);
        }
    };

    const setUpdate = (newValue) => {
        setIsUpdated(newValue);
    };

    useEffect(()=>{
        getBuckets();
    }, [isUpdated]);

    return(
        <div className={classes.root}> 
             <Grid container spacing={3}>
                <Grid item xs={12} className={classes.title}>
                    <Typography variant="h2" >Control de Stock</Typography>
                </Grid>

                <Grid item xs={4}>
                    <Paper className={classes.paper} onClick={()=>{setShowAviable(true); setshowInCharge(false); setshowBroken(false)}}>
                        <Typography variant="h5"><CheckCircle className={classes.iconPaper} fontSize="large" />Disponible</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={4}>
                    <Paper className={classes.paper} onClick={()=>{setShowAviable(false); setshowInCharge(true); setshowBroken(false)}}>
                        <Typography variant="h5"><LocalShipping className={classes.iconPaper} fontSize="large" />Encargado</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={4}>
                    <Paper className={classes.paper} onClick={()=>{setShowAviable(false); setshowInCharge(false); setshowBroken(true)}}>
                        <Typography variant="h5"><BrokenImage className={classes.iconPaper} fontSize="large" />Roto</Typography>
                    </Paper>
                </Grid>
            
            </Grid>

            {!showAviable && !showInCharge && !showBroken ? (
                <Grid container spacing={3}>
                    <Grid item xs={12} className={classes.title}>
                        <Typography variant="h5" >Seleccione una opción para ver el estados de sus productos.</Typography>    
                    </Grid>
                </Grid>
            ) : (
                showAviable ? (
                    <Box m={4}>
                        <Grid container spacing={4} className={classes.gridContainer}>
                            <Grid item xs={12}>
                                <Typography variant="h2" >Unidades Disponible</Typography>
                            </Grid>
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
                                Enviar a    
                            </Grid>
                            
                        </Grid>

                        {bucketList.map((bucketItem) => <Product key={`aviable-${bucketItem.id}`} bucket={bucketItem} quantityType={config.bucketType.aviable} isUpdated={setUpdate}></Product>)}
                    </Box>
                    
                ):(
                    showInCharge ? (
                        <Box m={4}>
                            <Grid container spacing={4} className={classes.gridContainer}>
                                <Grid item xs={12}>
                                    <Typography variant="h2" >Unidades Encargadas</Typography>
                                </Grid>
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
                                    Enviar a
                                </Grid>

                            </Grid>

                            {bucketList.map((bucketItem) => <Product key={`in-charge-${bucketItem.id}`} bucket={bucketItem} quantityType={config.bucketType.inCharge} isUpdated={setUpdate}></Product>)}
                        </Box>
                    ):(
                        <Box m={4}>
                            <Grid container spacing={4} className={classes.gridContainer}>
                                <Grid item xs={12}>
                                    <Typography variant="h2" >Unidades Rotas</Typography>
                                </Grid>
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
                                    Enviar a
                                </Grid>
                                
                            </Grid>
                            {bucketList.map((bucketItem) => <Product key={`broken-${bucketItem.id}`} bucket={bucketItem} quantityType={config.bucketType.broken} isUpdated={setUpdate}></Product>)}
                        </Box>
                    )
                )
            )}
            
        </div>
    )
};

export default StockManagment;