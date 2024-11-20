'use client';

interface IProps {
  visible: boolean;
}

export const Loading = ({ visible }: IProps) => {
  return (
    visible && (
      <div
        className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-30 z-50"
        style={{ width: '100%', height: '100%' }}
      >
        <div
          className="spinner-border animate-spin border-t-4 border-solid border-blue-500 rounded-full"
          style={{
            width: '3rem',
            height: '3rem',
          }}
          role="status"
        >
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    )
  );
};
