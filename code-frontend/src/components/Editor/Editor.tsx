import { useRef, useState, useEffect } from 'react';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import axios from 'axios';
const Editor = () => {
	const [editor, setEditor] = useState<monaco.editor.IStandaloneCodeEditor | null>(null);
	const monacoEl = useRef(null);
	const [output, setOutput] = useState<string>("Run Code to See Output!");
    const handleCompile = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
		setOutput("Loading...");
        const res = await axios.post("http://localhost:3000/code", { code: editor?.getValue() });
		if (res.status == 200) {
			console.log(res.data.output);
		} else {
			console.log(res.data.error);
		}
    }
    
	useEffect(() => {
		if (monacoEl) {
			setEditor((editor) => {
				if (editor) return editor;
				return monaco.editor.create(monacoEl.current!, {
					value: ['function x() {', '\tconsole.log("Hello world!");', '}'].join('\n'),
					language: 'javascript',
					fontSize: 16,
					minimap: {
						enabled: false
					},
				});
			});
		}

		return () => editor?.dispose();
	}, [monacoEl.current]);

	return <div className='flex flex-col w-full gap-2'>
		<div className='w-full flex md:flex-row flex-col gap-[2vw] items-center'>
        	<div ref={monacoEl} className='w-[80vw] h-[90vh]'></div>
			<div className='card w-[18vw] bg-slate-200 h-3/5'>
				<div className='card-body'>
					<div className="card-title text-lg text-black">
						OUTPUT
					</div>
					div.
				</div>
			</div>
		</div>
        <button className='btn btn-primary self-center' onClick={handleCompile}>Compile & Run</button>
    </div>;
};

export default Editor;