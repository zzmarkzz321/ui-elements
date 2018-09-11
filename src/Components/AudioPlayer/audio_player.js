import React, {Component, Fragment} from 'react'
import PropTypes from 'prop-types';

import {Grid, Cell} from 'react-foundation';

import Icon from 'react-icons-kit';
import { ic_play_circle_filled } from 'react-icons-kit/md/ic_play_circle_filled';
import { ic_pause_circle_filled } from 'react-icons-kit/md/ic_pause_circle_filled';

export default class AudioPlayer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            stopped: true,
            timelineWidth: 224,
        };
        this.audioPlayer = React.createRef();
        this.progressMeter = React.createRef();
        this.timeline = React.createRef();
    }

    toggleAudio = () => {
        const audioPlayer = this.audioPlayer.current;

        if (audioPlayer.currentTime === 0) {
            audioPlayer.load();
        }

        if (audioPlayer.paused) {
            audioPlayer.play();
            this.setState({
                stopped: false,
            })
        } else {
            audioPlayer.pause();
            audioPlayer.currentTime = 0;
            this.setState({
                stopped: true,
            })
        }
    };

    updateTimeline = () => {
        const audioPlayer = this.audioPlayer.current;
        const progressMeter = this.progressMeter.current;
        const {duration, currentTime} = audioPlayer;

        if (progressMeter) {
            const percentage = 100 * (currentTime / duration);
            progressMeter.style.width = `${percentage}%`;

            if (percentage === 100) {
                this.toggleAudio();
            }
        }
    };

    skipTimeline = event => {
        const audioPlayer = this.audioPlayer.current;
        audioPlayer.currentTime = audioPlayer.duration * this.clickPercent(event);
    };

    clickPercent = event => {
        const timeline = this.timeline.current;
        const {timelineWidth} = this.state;

        return (event.clientX - this.getPosition(timeline)) / timelineWidth;
    };

    getPosition = element => {
        return element.getBoundingClientRect().left;
    };

    renderAudioPlayer = () => {
        const {stopped} = this.state;
        const audioPlayer = this.audioPlayer.current;
        const duration = (audioPlayer && audioPlayer.duration) || 0;

        return (
            <Grid className='audio-player-wrapper'>
                <Cell small={2}>
                    {stopped ?
                        <Icon className='play-button play-button--play' icon={ic_play_circle_filled} onClick={this.toggleAudio}/>
                        :
                        <Icon className='play-button play-button--stop' icon={ic_pause_circle_filled} onClick={this.toggleAudio}/>
                    }
                </Cell>
                <Cell small={8}>
                    {!stopped ?
                        <Fragment>
                            <div className='timeline' ref={this.timeline} onClick={(e) => this.skipTimeline(e)}>
                                <div className='progress-meter' ref={this.progressMeter}/>
                            </div>
                            <div className='audio-duration'>{(duration)}</div>
                        </Fragment>
                        :
                        <span className='audio-duration'>{(duration)}</span>
                    }
                </Cell>
            </Grid>
        )
    };

    render() {
        const {url} = this.props;
        return (
            <div className='audio-player'>
                <audio preload='true' ref={this.audioPlayer} onTimeUpdate={this.updateTimeline}>
                    <source src={url} type="audio/ogg" />
                    <source src={url} type="audio/mpeg" />
                </audio>
                {this.renderAudioPlayer()}
            </div>
        )
    }
}

AudioPlayer.propTypes = {
    url: PropTypes.string,
};