import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@src/store';
import { ILrcConfig } from '@src/types';
import { IPlayLrc } from '@src/types';

interface IProps {
  translateY?: number;
  lrcBoxRef: React.LegacyRef<HTMLDivElement>;
}

const LrcScroll: React.FC<IProps> = props => {
  const { translateY = 0, lrcBoxRef } = props;

  const lrcConfig = useSelector<RootState, ILrcConfig>(
    state => state.lrcConfig
  );
  const curPlayLrcArr = useSelector<RootState, IPlayLrc[]>(
    state => state.curPlayLrcArr
  );

  return (
    <div
      className='lrc-box'
      ref={lrcBoxRef}
      style={{
        transform: 'translateY(-' + translateY + 'px)',
        color: lrcConfig.defaultColor,
      }}
    >
      {curPlayLrcArr.map((lrcObj, index) => {
        return (
          <p
            key={index}
            style={{
              color:
                lrcConfig.activeLrcIndex === index ? lrcConfig.activeColor : '',
            }}
            data-starttime={lrcObj.startTime}
          >
            {lrcObj.curLrc}
          </p>
        );
      })}
    </div>
  );
};

export default LrcScroll;
