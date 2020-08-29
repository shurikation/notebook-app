export class Transform {
  static firebaseObjectToArray(firebaseData) {
    return Object.keys(firebaseData).map(key => {
      const item = firebaseData[key];
      item.id = key; //добавить ключ в объект - сгенерированный Firebase уникальный id
      return item;
    });
  }
}