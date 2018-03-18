import React, { Component } from 'react';
import WebTorrent from 'webtorrent';
import Dropzone from 'react-dropzone'
import classNames from 'classnames';
import TorrentList from './main/TorrentList';
// const client = new WebTorrent();
import { observe, autorun } from 'mobx';
import { observer, inject } from 'mobx-react';

@inject("torrentStore")
@observer

class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: null,
            torrents: [],
            isDropzoneOver: false,
        }
    }

    dropzoneDrag(e, status) {
        switch (status) {
            case "Enter":
                if (e.dataTransfer.types[0] == "Files") this.setState({ isDropzoneOver: true });
                break;
            case "Leave":
                this.setState({ isDropzoneOver: false });
                break;
        }
    }

    onDropzone(accept) {
        this.props.torrentStore.onSeedTorrent(accept);
        this.setState({ isDropzoneOver: false });
    }

    render() {
        const { isDropzoneOver } = this.state;
        const torrents = this.props.torrentStore.torrents;
        let isNotNewTorrent = false;
        if (torrents.length === 0) {
            isNotNewTorrent = false;
        } else {
            isNotNewTorrent = true;
        }
        return (
            <div style={{ height: 'calc( 100% - 64px )', overflow: 'auto' }}>
                <TorrentList />
                <Dropzone
                    className={classNames("dropzone", { small: isNotNewTorrent })}
                    disableClick
                    disablePreview
                    onDragEnter={(e) => { this.dropzoneDrag(e, "Enter") }}
                    onDragLeave={(e) => { this.dropzoneDrag(e, "Leave") }}
                    onDropAccepted={(accept) => { this.onDropzone(accept) }}
                    ref={dropzone => { this.dropezone = dropzone }}
                >
                    <UploadButton torrents={torrents} active={isDropzoneOver} onClick={() => this.dropezone.open()} />
                </Dropzone>
            </div>
        );
    }
}

function UploadButton(props) {
    const { torrents, active, onClick } = props;
    let listEmpty = true;
    if (torrents.length === 0) {
        return (
            <div className="container center">
                <div className="content">
                    <div className={classNames('upload', { active: active })} onClick={onClick}>
                        <img src="/logo.svg" />
                    </div>
                    <h1 className="upload-title">Drag and Drop files here.</h1>
                </div>
            </div>
        )
    } else {
        return (
            <div className={classNames('upload-small', { active: active })} onClick={onClick}>
                <img src="/logo.svg" />
            </div>
        )
    }
}

export default Main;