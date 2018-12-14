import React from "react";
import Submit from "./page/submit/Submit";
import Register from "./page/register/Register";
import { Route, Switch } from "react-router";
import { HashRouter } from "react-router-dom";
import MainLayout from "./MainLayout";
import OrderDetails from "./page/orderDetails/index" 

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: "blueTab",
      hidden: false
    };
  }

  renderContent(pageText) {
    return (
      <div
        style={{
          backgroundColor: "white",
          height: "100%",
          textAlign: "center"
        }}
      >
        <div style={{ paddingTop: 60 }}>
          Clicked “{pageText}” tab， show “{pageText}” information
        </div>
        <a
          style={{
            display: "block",
            marginTop: 40,
            marginBottom: 20,
            color: "#108ee9"
          }}
          onClick={e => {
            e.preventDefault();
            this.setState({
              hidden: !this.state.hidden
            });
          }}
        >
          Click to show/hide tab-bar
        </a>
      </div>
    );
  }

  render() {
    // console.log(process.env);
    // console.log(process.argv);

    return (
      <HashRouter>
        <Switch>
          <Route path="/" exact component={MainLayout} />
          <Route path="/login" component={Submit} />
          <Route path="/submit/" component={MainLayout} />
          <Route path="/grade/" component={MainLayout} />
          <Route path="/myGrade/" component={MainLayout} />
          <Route path={`/my/`} component={MainLayout} />
          <Route path={`/register`} component={Register} />
          <Route path="/a/:id" component={MainLayout} />
          <Route path="/s/:id" component={MainLayout} />
          <Route path="/w/:id" component={OrderDetails} />
          <Route path="/attention" component={MainLayout} />
          <Route path="/help" component={MainLayout} />
          <Route path="/review" component={MainLayout} />
          <Route path="/mylist/:id" component={MainLayout} />
          <Route path="/mylist" component={MainLayout} />

          {/* <Redirect to="/" /> */}
        </Switch>
      </HashRouter>
    );
  }
}
export default App;
