/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import TextWithMarkdown from './TextWithMarkdown';

export default function NotePreview({body}) {
  return (
    <div className="note-preview">
      <TextWithMarkdown text={body} />
    </div>
  );
}
