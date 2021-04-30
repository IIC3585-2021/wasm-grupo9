// Código obtenido de:
// https://www.thecrazyprogrammer.com/2017/05/travelling-salesman-problem.html
#include<stdio.h>
#include <stdint.h>
#include <stdlib.h>

 
int ary[10][10];
int n;
int N = 10;

void fillMatrix(uint32_t** matrix)
{
    for (int row = 0; row < N; row++)
    {
        for (int col = 0; col < N; col++){
            matrix[row][col] = 0;}
    }
}

uint32_t** getNewMatrix(){
	uint32_t** matrix = (uint32_t**) calloc(10, sizeof(uint32_t*));
	for(int i = 0; i < N; i++){
		matrix[i] = (uint32_t*) calloc(N, sizeof(uint32_t));
	}
	return matrix;
}

uint32_t* getNewPath(){
	uint32_t* path = (uint32_t*) calloc(10, sizeof(uint32_t));
	return path;
}

int least(int c, uint32_t** matrix, uint32_t* completed, int* cost, int n)
{
	int i;
	int nc=999;
	int min=999;
	int kmin;
 
	for(i = 0; i < n; i++)
	{
		if((matrix[c][i] != 0) && (matrix[c][i] != -1) && (completed[i] == 0))
			if(matrix[c][i] + matrix[i][c] < min)
			{
				min = matrix[i][0] + matrix[c][i];
				kmin = matrix[c][i];
				nc = i;
			}
	}
 
	if(min != 999)
		*cost += kmin;

	return nc;
}



// Función que toma el input del usuario e imprime la matriz
void takeInput(uint32_t** matrix, uint32_t* completed)
{
	int i,j;
 
	printf("Enter the number of villages: ");
	scanf("%d", &n);
 
	printf("\nEnter the Cost Matrix\n");
 
	for(i=0;i < n;i++)
	{
		printf("\nEnter Elements of Row: %d\n",i+1);
 
		for( j=0;j < n;j++){
			scanf("%d",&matrix[i][j]);
		}
		completed[i]=0;
	}
 
	printf("\n\nThe cost list is:");
 
	for( i = 0; i < n; i++)
	{
		printf("\n");
 
		for(j = 0; j < n; j++)
			printf("\t%d", matrix[i][j]);
	}
}
 

void mincost(int city, uint32_t** matrix, uint32_t* path, int index, uint32_t* completed, int* cost, int n)
{
	int i;
	int ncity;
 
	completed[city] = 1;
 
	printf("%d--->", city + 1);
	path[index] = city + 1;
	index++;
	ncity = least(city, matrix, completed, cost, n);
 
	if(ncity == 999)
	{
		ncity = 0;
		printf("%d", ncity + 1);
		path[index] = ncity + 1;
		index++;
		*cost += matrix[city][ncity];
 
		return;
	}
 
	mincost(ncity, matrix, path, index, completed, cost, n);
}


 
int main()
{
	uint32_t** matrix = getNewMatrix();
	uint32_t* path = getNewPath();
	uint32_t* completed = getNewPath();
	int cost = 0;
	
	fillMatrix(matrix);
	takeInput(matrix, completed);
	printf("\n\nThe Path is:\n");
	mincost(0, matrix, path, 0, completed, &cost, 3); //passing 0 because starting vertex
 
	printf("\n\nMinimum cost is %d\n ", cost);
	// Imprimiendo el camino
	for(int l = 0; l < 10; l++){
			printf("%d", path[l]);
	}
	return 0;
}