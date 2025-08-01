import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Casa {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 500 })
  nombre: string;

  @Column()
  valor: number;

  @Column()
  imagenURL: string;

  // Nuevos campos para autenticación
  @Column({ nullable: true })
  username?: string;

  @Column({ nullable: true })
  password?: string;

  // Nuevos campos para el archivo
  @Column({ nullable: true })
  fileContentType?: string;

  @Column({ nullable: true })
  filename?: string;

  @Column({ nullable: true })
  fileID?: string;
}