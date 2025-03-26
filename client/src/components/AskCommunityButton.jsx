import { ImPencil } from 'react-icons/im'

function AskCommunityButton() {
    return (
        <div className="flex justify-center items-center gap-[1rem] absolute bottom-[1rem] right-[0.5rem] bg-blue-600 p-[1rem] rounded-full">
            <ImPencil className="text-white" size={15} />
            <h3 className="text-white font-bold">Ask Community</h3>
        </div>
    )
}

export default AskCommunityButton
