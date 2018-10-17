import {
  DocumentChangeAction,
  DocumentSnapshot,
  Action
} from '../../frontend/node_modules/@angular/fire/firestore';

export const listToEntities = (pk: string = 'id') => (list: any[]) =>
  list.reduce(
    (prev, curr) => ({
      ...prev,
      [curr[pk]]: curr
    }),
    {}
  );

export const entitiesToList = <Model extends any>(
  pk: string = 'id'
) => (entities: { [_pk: string]: Model }) =>
  Object.keys(entities).map((id: string) => ({
    ...(<any>entities[id]),
    [pk]: id
  }));

export const documentChangeActionToEntities = <Entity extends any>(
  pk: string = 'id'
) => (documents: DocumentChangeAction<any>[]) =>
  documents.reduce<Entity>(
    (prev: Entity, { payload }) => ({
      ...(<any>prev),
      [payload.doc.id]: {
        ...payload.doc.data(),
        [pk]: payload.doc.id
      }
    }),
    <Entity>{}
  );

export const documentChangeActionToList = <Model extends any>(
  pk: string = 'id'
) => (documents: DocumentChangeAction<any>[]) =>
  documents.map<Model[]>(document => ({
    ...document.payload.doc.data(),
    [pk]: document.payload.doc.id
  }));

export const actionDocumentSnapshotToModel = <Model extends any>(
  pk: string = 'id'
) => (document: Action<DocumentSnapshot<any>>): Model => ({
  ...document.payload.data(),
  [pk]: document.payload.id
});

export const parseFormValueToQueryParams = formValue =>
  Object.entries(formValue).reduce(
    (params, [key, value]) =>
      value !== null && value !== undefined
        ? { ...params, [key]: value }
        : params,
    {}
  );

export const listToEntitiesOrdenation = (pk: string = 'id') => list =>
  list.reduce(
    (prev, curr) => ({
      entities: {
        ...prev.entities,
        [curr[pk]]: curr
      },
      ordenation: [...prev.ordenation, curr[pk]]
    }),
    { entities: {}, ordenation: [] }
  );

export const parseStringToNumber = (value: string, _default: number = 0) => {
  let _value: string | number = value.toString();

  if (!value) return _default;

  _value = parseFloat(_value.replace(',', '.'));
  if (isNaN(_value)) return 0;

  return _value;
};
