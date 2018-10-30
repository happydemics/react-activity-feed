//@flow
import React from 'react';
import ReactionList from './ReactionList';
import CommentItem from './CommentItem';
import type { BaseReactionMap } from '../types';

export type Props = {|
  reactions: BaseReactionMap,
  renderCommentItem: (item: Comment, i: number) => mixed,
|};

/**
 * CommentList uses ReactionList under the hood to render a list of comments.
 *
 * @example ./examples/CommentList.md
 */
export default class CommentList extends React.Component<Props> {
  render() {
    const { reactions } = this.props;
    return (
      <React.Fragment>
        <ReactionList
          reactionKind={'comment'}
          reactions={reactions}
          Reaction={(comment) => <CommentItem comment={comment} />} // TODO: bettery key
        />
      </React.Fragment>
    );
  }
}
