import pandas as pd
from selenium import webdriver
from selenium.webdriver.common.by import By
import time

user = "vinicius_leite"
password = "12345"


produtos = "produtos.xlsx"
df = pd.read_excel("cadastro\produtos.xlsx")
options = webdriver.ChromeOptions()
driver = webdriver.Chrome()
options.add_experimental_option("detach", True)


driver.get("http://localhost:3000")
time.sleep(2)    
driver.find_element(By.XPATH, "//*[@id='root']/div/div/form/label[1]/input").clear()
driver.find_element(By.XPATH, "//*[@id='root']/div/div/form/label[1]/input").send_keys(user )
time.sleep(1) 
driver.find_element(By.XPATH, "//*[@id='root']/div/div/form/label[2]/input").send_keys(password)
driver.find_element(By.XPATH, '//*[@id="root"]/div/div/form/button').click()
time.sleep(3) 
driver.find_element(By.XPATH, '//*[@id="root"]/div/div[3]/div[2]/div[3]/button[3]').click(
)
for itens,row in df.iterrows():
    
    time.sleep(1) 
    driver.find_element(By.XPATH, '//*[@id="root"]/div/div[3]/div[2]/div[4]/form/div[1]/div[1]/label[1]/input').clear()
    driver.find_element(By.XPATH, '//*[@id="root"]/div/div[3]/div[2]/div[4]/form/div[1]/div[1]/label[1]/input').send_keys(row['Nome'])
    time.sleep(0.5)
    
    driver.find_element(By.XPATH, '//*[@id="root"]/div/div[3]/div[2]/div[4]/form/div[1]/div[1]/label[2]/input').clear()
    driver.find_element(By.XPATH, '//*[@id="root"]/div/div[3]/div[2]/div[4]/form/div[1]/div[1]/label[2]/input').send_keys(str(row['Imagem']))
    
    time.sleep(0.5)
    driver.find_element(By.XPATH, '//*[@id="root"]/div/div[3]/div[2]/div[4]/form/div[1]/div[2]/label[1]/input').clear()
    driver.find_element(By.XPATH, '//*[@id="root"]/div/div[3]/div[2]/div[4]/form/div[1]/div[2]/label[1]/input').send_keys(row['Estoque'])
    
    time.sleep(0.5)
    driver.find_element(By.XPATH, '//*[@id="root"]/div/div[3]/div[2]/div[4]/form/div[1]/div[2]/label[2]/input').clear()
    driver.find_element(By.XPATH, '//*[@id="root"]/div/div[3]/div[2]/div[4]/form/div[1]/div[2]/label[2]/input').send_keys(row['Valor'])
    
    time.sleep(0.5)
    driver.find_element(By.XPATH, '//*[@id="root"]/div/div[3]/div[2]/div[4]/form/div[2]/button').click()
    
    
