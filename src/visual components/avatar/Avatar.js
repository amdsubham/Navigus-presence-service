import React, { Component } from "react";
import Avatar from "@material-ui/core/Avatar";
import AvatarGroup from "@material-ui/lab/AvatarGroup";
import FirebaseConfig from "../../API_calls/config/FirebaseConfig";
import Icon1 from '../../static/Avatars/ico1.png';
import Icon2 from '../../static/Avatars/ico2.png';
import Icon3 from '../../static/Avatars/ico3.png';
import Icon4 from '../../static/Avatars/ico4.png';

class GroupAvatars extends Component {
  constructor(props) {
    super(props);
    this.state = {
      noOfAvatars: 1,
      AvtarStyles: [],

    };
    //this.getAvatars = this.getAvatars.bind(this);
  }
  componentWillMount() {
    var avatars=[];
    var that = this; 
    FirebaseConfig.auth().onAuthStateChanged((user) => {
      if (user) {
        var ref = FirebaseConfig.database().ref("/ActiveUsers/");
        ref
          .on(
            "value",
            function (snapshot) {
              var OnlineUsers = Object.keys(snapshot.val());
              for (var i = 0; i < OnlineUsers.length; i++) {
                var refDB = FirebaseConfig.database().ref(
                  "/Users Data/" + OnlineUsers[i]
                );

                refDB.on("value", function (snapshot) {
                  avatars.push(snapshot.val().avatar) ;
                  that.setState({
                    
                    AvtarStyles: [...that.state.AvtarStyles, snapshot.val().avatar]
                    
                    
                  });
  
                })
              }
            },
            function (errorObject) {
            }
          )
        // User logged in already or has just logged in.
      } else {
        // User not logged in or has just logged out.
      }
    });
  }
  showAvatars(){
    var JsxReturn= [];
    var FinalAvatars= this.state.AvtarStyles;
    for(var i=0;i<FinalAvatars.length;i++){
      if(FinalAvatars[i]==1)
      {
        JsxReturn.push(<Avatar alt="Remy Sharp" src= {Icon1} key={1} />);
      }
      else if(FinalAvatars[i]==2)
      {
        JsxReturn.push(<Avatar alt="Remy Sharp" src= {Icon2} key={2} />);
        
      }
      else if(FinalAvatars[i]==3)
      {
        JsxReturn.push(<Avatar alt="Remy Sharp" src= {Icon3} key={3}  />);
      }
      else if(FinalAvatars[i]==4)
      {
        JsxReturn.push(<Avatar alt="Remy Sharp" src= {Icon4} key={4} />);
      }
      
      
    }
    return JsxReturn;

  }

  render() {
    return (
      <AvatarGroup max={4}>
        {this.showAvatars()}

      </AvatarGroup>
    );
  }
}

export default GroupAvatars;
