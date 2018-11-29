import React from "react";
import {
    
    ImagePicker,
    
  } from "antd-mobile";


class ImagePickerExample extends React.Component {
    state = {
      files: [],
      multiple: false
    };
    onChange = (files, type, index) => {
      console.log(files, type, index);
      this.setState({
        files
      });
      this.props.form.setFieldsValue({ photo: files }, () =>
        console.log(this.props.form.getFieldProps("photo").value)
      );
  
      // put(files[files.length - 1].file);
    };
    onSegChange = e => {
      const index = e.nativeEvent.selectedSegmentIndex;
      this.setState({
        multiple: index === 1
      });
    };
    componentDidMount() {
      this.props.form.setFieldsValue({ photo: this.state.files });
    }
  
    render() {
      const { files } = this.state;
      return (
        <ImagePicker
          {...this.props.form.getFieldProps("photo")}
          files={files}
          onChange={this.onChange}
          onImageClick={(index, fs) => {
            console.log(index, fs);
            //   put(fs);
          }}
          selectable={files.length < 7}
          multiple={this.state.multiple}
        />
      );
    }
  }

  export default ImagePickerExample