import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import AudioPlayer from '../src/Components/AudioPlayer/audio_player';

import '../src/index.scss'

storiesOf('Button', module)
    .add('with text', () => (
        <AudioPlayer/>
    ))
    .add('with some emoji', () => (
        <button onClick={action('clicked')}><span role="img" aria-label="so cool">😀 😎 👍 💯</span></button>
    ));