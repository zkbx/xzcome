import React from "react";
import { render } from "react-dom";
import Gallery from "react-photo-gallery";
import Lightbox from "react-images";

export default class gallery extends React.Component {
  constructor() {
    super();
    this.state = { currentImage: 0 };
    this.closeLightbox = this.closeLightbox.bind(this);
    this.openLightbox = this.openLightbox.bind(this);
    this.gotoNext = this.gotoNext.bind(this);
    this.gotoPrevious = this.gotoPrevious.bind(this);
  }
  openLightbox(event, obj) {
    event.stopPropagation(); 
    this.setState({
      currentImage: obj.index,
      lightboxIsOpen: true
    });
  }
  closeLightbox() {
    this.setState({
      currentImage: 0,
      lightboxIsOpen: false
    });
  }
  gotoPrevious() {
    console.info("gotoPrevious");
    this.setState({
      currentImage: this.state.currentImage - 1
    });
  }
  gotoNext() {
    console.info("gotoNext");
    this.setState({
      currentImage: this.state.currentImage + 1
    });
  }
  render() {
    let myphotos = [];
    if (this.props.photos) {
      myphotos = this.props.photos.map(photo => {
        return {
          src: "https://img.xzllo.com/" + photo.src,
          width: this.props.width?this.props.width:photo.width,
          height: this.props.width?this.props.width:photo.height
        };
      });
    } else {
      return <div />;
    }
    return (
      <div>
        <Gallery photos={myphotos.slice(0, 1)} onClick={this.openLightbox} />
        <Lightbox
          images={myphotos}
          onClose={this.closeLightbox}
          onClickPrev={this.gotoPrevious}
          onClickNext={this.gotoNext}
          currentImage={this.state.currentImage}
          isOpen={this.state.lightboxIsOpen}
        />
      </div>
    );
  }
}
