'use client'
  import { formatDistance } from 'date-fns';
  import { AnimatePresence, motion } from 'framer-motion';
  import {
    memo,
    useCallback,
    useEffect,
    useState,
  } from 'react';
  import useSWR, { useSWRConfig } from 'swr';
  import { useDebounceCallback, useWindowSize } from 'usehooks-ts';
  
  import { cn, fetcher } from '@/lib/utils';
  
  import { Toolbar } from './toolbar';
  import { useSidebar } from '@/components/ui/sidebar';
  import { DiffView } from './diffview';
  import { DocumentSkeleton } from './document-skeleton';
  import { Editor } from './editor';
  import { MultimodalInput } from '@/components/main/forms/multimodal-input';
  import { VersionFooter } from './version-footer';
  import { BlockActions } from './block-actions';
  import { BlockCloseButton } from './block-close-button';
  import { BlockMessages } from './block-messages';
  import { CodeEditor } from '../code-editor';
  import { useBlock } from '@/hooks/use-block';
  import equal from 'fast-deep-equal';
import { BASE_URL } from '@/data/api-handler';
  
  
  // export interface UIBlock {
  //   title: string;
  //   documentId: string;
  //   kind: BlockKind;
  //   content: string;
  //   isVisible: boolean;
  //   status: 'streaming' | 'idle';
  //   boundingBox: {
  //     top: number;
  //     left: number;
  //     width: number;
  //     height: number;
  //   };
  // }
  
 
  function PureBlock({
    chatId,
    input,
    setInput,
    handleSubmit,
    isLoading,
    stop,
    append,
    messages,
    setMessages,
    reload,
  }) {
    const { block, setBlock } = useBlock();
  
    const {
      data: documents,
      isLoading: isDocumentsFetching,
      mutate: mutateDocuments,
    } = useSWR(
      block.documentId !== 'init' && block.status !== 'streaming'
        ? `${BASE_URL}/api/document/${block.documentId}/all`
        : null,
      fetcher,
    );
  
  
    const [mode, setMode] = useState('edit');
    const [document, setDocument] = useState(null);
    const [currentVersionIndex, setCurrentVersionIndex] = useState(-1);
   
    const { open: isSidebarOpen } = useSidebar();
  
    useEffect(() => {
      if (documents && documents.length > 0) {
        const mostRecentDocument = documents.at(-1);
  
        if (mostRecentDocument) {
          setDocument(mostRecentDocument);
          setCurrentVersionIndex(documents.length - 1);
          setBlock((currentBlock) => ({
            ...currentBlock,
            content: mostRecentDocument.content ?? '',
          }));
        }
      }
    }, [documents, setBlock]);
  
    useEffect(() => {
      mutateDocuments();
    }, [block.status, mutateDocuments]);
  
    const { mutate } = useSWRConfig();
    const [isContentDirty, setIsContentDirty] = useState(false);
  
    const handleContentChange = useCallback(
      (updatedContent) => {
        if (!block) return;
  
        mutate(
          `${BASE_URL}/api/document?id=${block.documentId}`,
          async (currentDocuments) => {
            if (!currentDocuments) return undefined;
  
            const currentDocument = currentDocuments.at(-1);
  
            if (!currentDocument || !currentDocument.content) {
              setIsContentDirty(false);
              return currentDocuments;
            }
  
            if (currentDocument.content !== updatedContent) {
              await fetch(`${BASE_URL}/api/document?id=${block.documentId}`, {
                method: 'POST',
                body: JSON.stringify({
                  title: block.title,
                  content: updatedContent,
                  kind: block.kind,
                  chatId
                }),
              });
  
              setIsContentDirty(false);
  
              const newDocument = {
                ...currentDocument,
                content: updatedContent,
                createdAt: new Date(),
              };
  
              return [...currentDocuments, newDocument];
            }
            return currentDocuments;
          },
          { revalidate: false },
        );
      },
      [block, mutate],
    );
  
    const debouncedHandleContentChange = useDebounceCallback(
      handleContentChange,
      2000,
    );
  
    const saveContent = useCallback(
      (updatedContent, debounce) => {
        if (document && updatedContent !== document.content) {
          setIsContentDirty(true);
  
          if (debounce) {
            debouncedHandleContentChange(updatedContent);
          } else {
            handleContentChange(updatedContent);
          }
        }
      },
      [document, debouncedHandleContentChange, handleContentChange],
    );
  
    function getDocumentContentById(index) {
      if (!documents) return '';
      if (!documents[index]) return '';
      return documents[index].content ?? '';
    }
  
    const handleVersionChange = (type) => {
      if (!documents) return;
  
      if (type === 'latest') {
        setCurrentVersionIndex(documents.length - 1);
        setMode('edit');
      }
  
      if (type === 'toggle') {
        setMode((mode) => (mode === 'edit' ? 'diff' : 'edit'));
      }
  
      if (type === 'prev') {
        if (currentVersionIndex > 0) {
          setCurrentVersionIndex((index) => index - 1);
        }
      } else if (type === 'next') {
        if (currentVersionIndex < documents.length - 1) {
          setCurrentVersionIndex((index) => index + 1);
        }
      }
    };
  
    const [isToolbarVisible, setIsToolbarVisible] = useState(false);
  
    /*
     * NOTE: if there are no documents, or if
     * the documents are being fetched, then
     * we mark it as the current version.
     */
  
    const isCurrentVersion =
      documents && documents.length > 0
        ? currentVersionIndex === documents.length - 1
        : true;
  
    const { width: windowWidth, height: windowHeight } = useWindowSize();
    const isMobile = windowWidth ? windowWidth < 768 : false;
  
    return (
      <AnimatePresence>
        {block.isVisible && (
          <motion.div
            className="flex flex-row h-dvh w-dvw fixed top-0 left-0 z-50 bg-transparent"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { delay: 0.4 } }}
          >
            {!isMobile && (
              <motion.div
                className="fixed bg-background h-dvh"
                initial={{
                  width: isSidebarOpen ? windowWidth - 256 : windowWidth,
                  right: 0,
                }}
                animate={{ width: windowWidth, right: 0 }}
                exit={{
                  width: isSidebarOpen ? windowWidth - 256 : windowWidth,
                  right: 0,
                }}
              />
            )}
  
            {!isMobile && (
              <motion.div
                className="relative w-[400px] bg-muted dark:bg-background h-dvh shrink-0"
                initial={{ opacity: 0, x: 10, scale: 1 }}
                animate={{
                  opacity: 1,
                  x: 0,
                  scale: 1,
                  transition: {
                    delay: 0.2,
                    type: 'spring',
                    stiffness: 200,
                    damping: 30,
                  },
                }}
                exit={{
                  opacity: 0,
                  x: 0,
                  scale: 1,
                  transition: { duration: 0 },
                }}
              >
                <AnimatePresence>
                  {!isCurrentVersion && (
                    <motion.div
                      className="left-0 absolute h-dvh w-[400px] top-0 bg-zinc-900/50 z-50"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    />
                  )}
                </AnimatePresence>
  
                <div className="flex flex-col h-full justify-between items-center gap-4">
                  <BlockMessages
                    chatId={chatId}
                    isLoading={isLoading}
                    messages={messages}
                    setMessages={setMessages}
                    reload={reload}
                    blockStatus={block.status}
                  />
  
                  <form className="flex flex-row gap-2 relative items-end w-full px-4 pb-4">
                    <MultimodalInput
                      chatId={chatId}
                      input={input}
                      setInput={setInput}
                      handleSubmit={handleSubmit}
                      isLoading={isLoading}
                      stop={stop}
                      messages={messages}
                      append={append}
                      className="bg-background dark:bg-muted"
                      setMessages={setMessages}
                    />
                  </form>
                </div>
              </motion.div>
            )}
  
            <motion.div
              className="fixed dark:bg-muted bg-background h-dvh flex flex-col overflow-y-scroll border-l dark:border-zinc-700 border-zinc-200"
              initial={
                isMobile
                  ? {
                      opacity: 1,
                      x: block.boundingBox.left,
                      y: block.boundingBox.top,
                      height: block.boundingBox.height,
                      width: block.boundingBox.width,
                      borderRadius: 50,
                    }
                  : {
                      opacity: 1,
                      x: block.boundingBox.left,
                      y: block.boundingBox.top,
                      height: block.boundingBox.height,
                      width: block.boundingBox.width,
                      borderRadius: 50,
                    }
              }
              animate={
                isMobile
                  ? {
                      opacity: 1,
                      x: 0,
                      y: 0,
                      height: windowHeight,
                      width: windowWidth ? windowWidth : 'calc(100dvw)',
                      borderRadius: 0,
                      transition: {
                        delay: 0,
                        type: 'spring',
                        stiffness: 200,
                        damping: 30,
                        duration: 5000,
                      },
                    }
                  : {
                      opacity: 1,
                      x: 400,
                      y: 0,
                      height: windowHeight,
                      width: windowWidth
                        ? windowWidth - 400
                        : 'calc(100dvw-400px)',
                      borderRadius: 0,
                      transition: {
                        delay: 0,
                        type: 'spring',
                        stiffness: 200,
                        damping: 30,
                        duration: 5000,
                      },
                    }
              }
              exit={{
                opacity: 0,
                scale: 0.5,
                transition: {
                  delay: 0.1,
                  type: 'spring',
                  stiffness: 600,
                  damping: 30,
                },
              }}
            >
              <div className="p-2 flex flex-row justify-between items-start">
                <div className="flex flex-row gap-4 items-start">
                  <BlockCloseButton />
  
                  <div className="flex flex-col">
                    <div className="font-medium">
                      {document?.title ?? block.title}
                    </div>
  
                    {isContentDirty ? (
                      <div className="text-sm text-muted-foreground">
                        Saving changes...
                      </div>
                    ) : document ? (
                      <div className="text-sm text-muted-foreground">
                        {`Updated ${formatDistance(
                          new Date(document.createdAt),
                          new Date(),
                          {
                            addSuffix: true,
                          },
                        )}`}
                      </div>
                    ) : (
                      <div className="w-32 h-3 mt-2 bg-muted-foreground/20 rounded-md animate-pulse" />
                    )}
                  </div>
                </div>
  
                <BlockActions
                  block={block}
                  currentVersionIndex={currentVersionIndex}
                  handleVersionChange={handleVersionChange}
                  isCurrentVersion={isCurrentVersion}
                  mode={mode}
                />
              </div>
  
              <div
                className={cn(
                  'dark:bg-muted bg-background h-full overflow-y-scroll !max-w-full pb-40 items-center',
                  {
                    'py-2 px-2': block.kind === 'code',
                    'py-8 md:p-20 px-4': block.kind === 'text',
                  },
                )}
              >
                <div
                  className={cn('flex flex-row', {
                    '': block.kind === 'code',
                    'mx-auto max-w-[600px]': block.kind === 'text',
                  })}
                >
                  {isDocumentsFetching && !block.content ? (
                    <DocumentSkeleton />
                  ) : block.kind === 'code' ? (
                    <CodeEditor
                      content={
                        isCurrentVersion
                          ? block.content
                          : getDocumentContentById(currentVersionIndex)
                      }
                      isCurrentVersion={isCurrentVersion}
                      currentVersionIndex={currentVersionIndex}
                      status={block.status}
                      saveContent={saveContent}
                    />
                  ) : block.kind === 'text' ? (
                    mode === 'edit' ? (
                      <Editor
                        content={
                          isCurrentVersion
                            ? block.content
                            : getDocumentContentById(currentVersionIndex)
                        }
                        isCurrentVersion={isCurrentVersion}
                        currentVersionIndex={currentVersionIndex}
                        status={block.status}
                        saveContent={saveContent}
                      />
                    ) : (
                      <DiffView
                        oldContent={getDocumentContentById(
                          currentVersionIndex - 1,
                        )}
                        newContent={getDocumentContentById(currentVersionIndex)}
                      />
                    )
                  ) : null}
  
  
                  <AnimatePresence>
                    {isCurrentVersion && (
                      <Toolbar
                        isToolbarVisible={isToolbarVisible}
                        setIsToolbarVisible={setIsToolbarVisible}
                        append={append}
                        isLoading={isLoading}
                        stop={stop}
                        setMessages={setMessages}
                        blockKind={block.kind}
                      />
                    )}
                  </AnimatePresence>
                </div>
              </div>
  
              <AnimatePresence>
                {!isCurrentVersion && (
                  <VersionFooter
                    currentVersionIndex={currentVersionIndex}
                    documents={documents}
                    handleVersionChange={handleVersionChange}
                  />
                )}
              </AnimatePresence>
  
      
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }
  
  export const Block = memo(PureBlock, (prevProps, nextProps) => {
    if (prevProps.isLoading !== nextProps.isLoading) return false;
    if (prevProps.input !== nextProps.input) return false;
    if (!equal(prevProps.messages, nextProps.messages.length)) return false;
  
    return true;
  });
  