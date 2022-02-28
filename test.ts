function getquery<T>(data: T): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    if (data) {
      resolve(data)
    } else {
      reject({ err: 'Error' })
    }
  })
}

getquery<Object>({ message: 'test' })

const cbgetquery = <T>(data: T): Promise<T> => {
  return new Promise((resolve, reject) => {
    if (data) {
      resolve(data)
    } else {
      reject({ err: 'Error' })
    }
  })
}

cbgetquery<string>('text')
