import React,{useState, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import{ Grid, Typography, Button, TextField, Box } from '@material-ui/core';
import config from './config';

const useStyles = makeStyles((theme) => ({
    root: {
      '& > *': {
        margin: theme.spacing(1),
        width: '25ch',
      },
      
    },
    gridContainer: {
        borderTop: '2px solid #9e9e9e',
        textAlign: 'center',
    }
  }));

const Product = ({bucket, quantityType}) => {
    const classes = useStyles();

    return(
        <Grid container spacing={3} className={classes.gridContainer}>
            <Grid item xs={3}>
                <Typography variant="body1">{bucket.product.name}</Typography>
            </Grid>
            <Grid item xs={3}>
                <Typography variant="body1">{bucket[quantityType]}</Typography>
            </Grid>
            <Grid item xs={3}>
                <form className={classes.root} noValidate autoComplete="off">
                    <TextField id={`product-${bucket.product.id}-selected`} label="Cantidad" variant="outlined" type="number" InputProps={{ inputProps: { min: 0, max: bucket[quantityType] }}}/>
                </form>
            </Grid>
            
                {quantityType === config.bucketType.aviable ? (
                    <Grid item xs={3}>
                        <Button variant="contained" color="primary">
                            Enviar a Entregados
                        </Button>
                        <Button variant="contained" color="secondary">
                            Enviar a Rotos
                        </Button>
                    </Grid>
                ):(
                    quantityType === config.bucketType.inCharge ? (
                        <Grid item xs={3}>
                            <Button variant="contained" color="primary">
                                Enviar a Disponible
                            </Button>
                            <Button variant="contained" color="secondary">
                                Enviar a Rotos
                            </Button>
                        </Grid>
                    ):(
                        <Grid item xs={3}>
                            <Button variant="contained" color="primary">
                                Enviar a Disponible
                            </Button>
                            <Button variant="contained" color="secondary">
                                Enviar a Entregados
                            </Button>
                        </Grid>
                    )
                )}
              
        </Grid>    
        
    )
};

export default Product;