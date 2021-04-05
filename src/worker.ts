import { ActionMessage } from './interfaces';
import LifeProgression from './life-progression';

let lifeProgression: LifeProgression;

function emit(data: unknown): void {
  // Temporary fix due to type error for 'postMessage' ('targetOrigin' should be optional)
  (postMessage as (data: unknown) => void)(data);
}

onmessage = (event: MessageEvent<ActionMessage>): void => {
  switch(event.data.action) {
    case 'new-game': {
      if (event.data.config) {
        lifeProgression = new LifeProgression(
          event.data.config,
          (generationInfo) => emit(generationInfo)
        );
      }
      break;
    }
    case 'restart-game': {
      lifeProgression.restartGame();
      break;
    }
    case 'toggle-game-pause': {
      lifeProgression.togglePauseResume();
      break;
    }
    case 'save-game': {
      lifeProgression.saveGame();
      break;
    }
    default: {
      break;
    }
  }
};
