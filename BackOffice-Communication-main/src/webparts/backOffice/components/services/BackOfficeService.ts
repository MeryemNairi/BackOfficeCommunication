import { sp } from '@pnp/sp/presets/all';
import { WebPartContext } from '@microsoft/sp-webpart-base';


export interface IFormProps {
  context: WebPartContext;
}


export interface IFormData {
  id: number; 
  offre_title: string;
  short_description: string;
  deadline: Date;
  file: File | null;
  fileUrl?: string;
  fileName: string; 

}

export const submitForm = async (formData: IFormData) => {
  try {
    const fileItem = await sp.web.lists.getByTitle('BackOfficeV0').rootFolder.files.add(formData.file!.name, formData.file!, true);
    const fileUrl = fileItem.data.ServerRelativeUrl;

    const list = sp.web.lists.getByTitle('Communication');
    await list.items.add({
      offre_title: formData.offre_title, 
      short_description: formData.short_description, 
      deadline: formData.deadline.toISOString(),
      fileUrl: fileUrl,
      fileName: formData.file ? formData.file.name : '', // Enregistrer le nom de fichier s'il existe

    });
  } catch (error) {
    console.error('Error submitting form:', error);
    throw new Error('An error occurred while submitting the form. Please try again.');
  }
};

export const getFormData = async (): Promise<IFormData[]> => {
  try {
      const list = sp.web.lists.getByTitle('Communication');
      const items = await list.items.select('Id', 'offre_title', 'short_description', 'deadline', 'fileUrl', 'fileName').get();
      return items.map((item: any) => ({
          id: item.Id,
          offre_title: item.offre_title,
          short_description: item.short_description,
          deadline: new Date(item.deadline),
          file: null,
          fileUrl: item.fileUrl,
          fileName: item.fileName, 
      }));
  } catch (error) {
      console.error('Error fetching form data:', error);
      throw new Error('An error occurred while fetching form data. Please try again.');
  }
};


export const updateFormEntry = async (id: number, formData: IFormData) => {
    try {
      const list = sp.web.lists.getByTitle('Communication');
      await list.items.getById(id).update({
        offre_title: formData.offre_title, 
        short_description: formData.short_description, 
        deadline: formData.deadline, 
      });
    } catch (error) {
      console.error('Error updating form entry:', error);
      throw new Error('An error occurred while updating the form entry. Please try again.');
    }
  };

  export const deleteFormEntry = async (id: number) => {
    try {
      const list = sp.web.lists.getByTitle('Communication');
      await list.items.getById(id).delete();
    } catch (error) {
      console.error('Error deleting form entry:', error);
      throw new Error('An error occurred while deleting the form entry. Please try again.');
    }
  };

