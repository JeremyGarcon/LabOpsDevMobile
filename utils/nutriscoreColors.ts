import { NutriscoreGrade } from '../types/searchresult.type';

export function getNutriscoreColor(grade?: NutriscoreGrade): string {
  if (!grade) return '#D1D5DB';
  
  switch (grade.toLowerCase()) {
    case 'a':
      return '#10B981'; // vert
    case 'b':
      return '#84CC16'; // vert clair
    case 'c':
      return '#FCD34D'; // jaune
    case 'd':
      return '#FB923C'; // orange
    case 'e':
      return '#EF4444'; // rouge
    default:
      return '#D1D5DB';
  }
}

export function getNutriscoreBgColor(grade?: NutriscoreGrade): string {
  const mainColor = getNutriscoreColor(grade);
  // Ajouter une opacité pour le fond
  if (!grade) return '#F3F4F6';
  
  switch (grade.toLowerCase()) {
    case 'a':
      return '#DCFCE7';
    case 'b':
      return '#F0FDF4';
    case 'c':
      return '#FFFACD';
    case 'd':
      return '#FEF3C7';
    case 'e':
      return '#FEE2E2';
    default:
      return '#F3F4F6';
  }
}
