export default function InferredData({keyName, value}: {keyName: string, value: string}) {
    return (
        <p>
            <strong className='text-lg mt-2 font-bold dark:text-white'>{keyName}:  </strong>
            <span className='mt-2 dark:text-gray-300'>
                {value}
            </span>

        </p>
    )
}