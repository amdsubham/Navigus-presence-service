import React, { Component } from "react";
import Header from "./visual components/Header/Header";
import Grid from "@material-ui/core/Grid";
import RecipeReviewCard from "./visual components/Card/card";

class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>
        <Grid container xs={12} sm={6} direction="column" >
          <Header />
          <RecipeReviewCard/>
        </Grid>

      </div>
    );
  }
}

export default HomePage;
