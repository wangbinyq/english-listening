import { generateDiffView } from '../utils/textDiff';
import { Modal } from './Modal';

interface DiffResultDialogProps {
  isOpen: boolean;
  originalText: string;
  userText: string;
  score: number;
  onClose: () => void;
}

export const DiffResultDialog = ({ isOpen, originalText, userText, score, onClose }: DiffResultDialogProps) => {
  const diffView = generateDiffView(originalText, userText);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Diff Result">
      <div className="diff-dialog-content">
        <div className="diff-dialog-score">
          <h3>Score: {score.toFixed(2)}%</h3>
        </div>
        <div className="diff-container">
          <div className="diff-original">
            <h4>Original Text:</h4>
            <div dangerouslySetInnerHTML={{ __html: diffView.originalDiff }} />
          </div>
          <div className="diff-user">
            <h4>Your Transcription:</h4>
            <div dangerouslySetInnerHTML={{ __html: diffView.userDiff }} />
          </div>
        </div>
      </div>
    </Modal>
  );
};